#!/usr/bin/env python3
"""
Fetch Cloudflare Web Analytics stats and print JSON to stdout.

Config (config.json in this same folder):
  {
    "account_id": "80a29a55534b...",
    "api_token": "cfut_..."
  }

Output schema:
  {"active": 3, "today": 42, "bySiteToday": {"doppel.cl": 30, "podfactory.cl": 12}}
or
  {"error": "human-readable reason"}
"""
import json
import sys
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ENDPOINT = "https://api.cloudflare.com/client/v4/graphql"


def out(payload):
    sys.stdout.write(json.dumps(payload))
    sys.exit(0)


def gql(token, query, variables):
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        ENDPOINT, data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read())
    if data.get("errors"):
        raise RuntimeError(str(data["errors"])[:200])
    return data["data"]


try:
    cfg = json.loads((HERE / "config.json").read_text())
except FileNotFoundError:
    out({"error": "falta config.json (copiá config.example.json)"})
except Exception as e:
    out({"error": f"config inválido: {e}"})

account = cfg.get("account_id")
token = cfg.get("api_token")
if not account or not token:
    out({"error": "config: faltan account_id o api_token"})

now = datetime.now(timezone.utc)
today_start = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat().replace("+00:00", "Z")
tomorrow_start = (now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)).isoformat().replace("+00:00", "Z")
last_30m = (now - timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
now_iso = now.strftime("%Y-%m-%dT%H:%M:%SZ")

q = """query Stats($a: String!, $todayStart: Time!, $todayEnd: Time!, $live: Time!, $now: Time!) {
  viewer {
    accounts(filter: {accountTag: $a}) {
      today: rumPageloadEventsAdaptiveGroups(
        limit: 100,
        filter: {datetime_geq: $todayStart, datetime_lt: $todayEnd}
      ) { count dimensions { requestHost } }
      live: rumPageloadEventsAdaptiveGroups(
        limit: 100,
        filter: {datetime_geq: $live, datetime_lt: $now}
      ) { count dimensions { requestHost } }
    }
  }
}"""

try:
    d = gql(token, q, {
        "a": account,
        "todayStart": today_start,
        "todayEnd": tomorrow_start,
        "live": last_30m,
        "now": now_iso,
    })
    accounts = d["viewer"]["accounts"]
    if not accounts:
        out({"error": "account not found"})

    today_rows = accounts[0]["today"]
    live_rows = accounts[0]["live"]

    by_site = {r["dimensions"]["requestHost"]: r["count"] for r in today_rows}
    total_today = sum(by_site.values())
    active = sum(r["count"] for r in live_rows)

    out({
        "active": active,
        "today": total_today,
        "bySiteToday": by_site,
    })
except urllib.error.HTTPError as e:
    out({"error": f"HTTP {e.code}: {e.reason}"})
except urllib.error.URLError as e:
    out({"error": f"red: {e.reason}"})
except Exception as e:
    out({"error": str(e)[:200]})
