#!/usr/bin/env python3
"""
Fetch GA4 stats for the Doppel + Pod Factory property and print JSON to stdout.

Config (config.json in this same folder):
  {
    "property_id": "123456789",
    "service_account_path": "/absolute/path/to/service-account.json"
  }

Output schema (always valid JSON, never crashes the widget):
  {"realtime": 3, "usersToday": 42, "waClicks": 5,
   "bySiteToday": {"doppel.cl": 30, "podfactory.cl": 12}}
or
  {"error": "human-readable reason"}
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def out(payload):
    sys.stdout.write(json.dumps(payload))
    sys.exit(0)


try:
    cfg = json.loads((HERE / "config.json").read_text())
except FileNotFoundError:
    out({"error": "falta config.json (copiá config.example.json)"})
except Exception as e:
    out({"error": f"config inválido: {e}"})

property_id = cfg.get("property_id")
sa_path = cfg.get("service_account_path")
if not property_id or not sa_path:
    out({"error": "config: faltan property_id o service_account_path"})

try:
    from google.oauth2 import service_account
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Metric, RunReportRequest, RunRealtimeReportRequest,
    )
except ImportError:
    out({"error": "pip3 install --user google-analytics-data google-auth"})

try:
    creds = service_account.Credentials.from_service_account_file(sa_path)
    client = BetaAnalyticsDataClient(credentials=creds)
    prop = f"properties/{property_id}"

    rt = client.run_realtime_report(RunRealtimeReportRequest(
        property=prop,
        metrics=[Metric(name="activeUsers")],
    ))
    realtime = int(rt.rows[0].metric_values[0].value) if rt.rows else 0

    users = client.run_report(RunReportRequest(
        property=prop,
        date_ranges=[DateRange(start_date="today", end_date="today")],
        dimensions=[Dimension(name="hostName")],
        metrics=[Metric(name="totalUsers")],
    ))
    by_site = {}
    total_users = 0
    for row in users.rows:
        host = row.dimension_values[0].value or "(unknown)"
        n = int(row.metric_values[0].value)
        by_site[host] = by_site.get(host, 0) + n
        total_users += n

    events = client.run_report(RunReportRequest(
        property=prop,
        date_ranges=[DateRange(start_date="today", end_date="today")],
        dimensions=[Dimension(name="eventName")],
        metrics=[Metric(name="eventCount")],
    ))
    wa_clicks = 0
    for row in events.rows:
        if row.dimension_values[0].value == "whatsapp_click":
            wa_clicks = int(row.metric_values[0].value)
            break

    out({
        "realtime": realtime,
        "usersToday": total_users,
        "waClicks": wa_clicks,
        "bySiteToday": by_site,
    })
except Exception as e:
    out({"error": str(e)[:200]})
