// Gate de clave para /latam360/* (demo privado).
// Cambia PASSWORD por la clave que quieras compartir.
const PASSWORD = 'latam2026';
const COOKIE = 'l360';
const TOKEN = 'b7c1e2-latam360-grant';

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Los assets (logos, fuente) se sirven sin clave para poder mostrarlos en el login.
  if (url.pathname.startsWith('/latam360/assets/')) {
    return next();
  }

  // Ya autenticado → servir el contenido real.
  const cookie = request.headers.get('Cookie') || '';
  if (cookie.split(/;\s*/).includes(`${COOKIE}=${TOKEN}`)) {
    return next();
  }

  // Envío del formulario de clave.
  if (request.method === 'POST') {
    const form = await request.formData();
    const key = String(form.get('key') || '').trim();
    if (key === PASSWORD) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname.endsWith('/') ? url.pathname : url.pathname + '/',
          'Set-Cookie': `${COOKIE}=${TOKEN}; Path=/latam360; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`
        }
      });
    }
    return loginPage(true);
  }

  // Sin acceso → pantalla de clave.
  return loginPage(false);
}

function loginPage(failed) {
  const html = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>LATAM 360° — Acceso</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; background: #1a0058; }
  body {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; width: 100%; padding: 20px;
    background: radial-gradient(120% 120% at 50% 0%, #2a0088 0%, #1a0058 70%);
    color: #fff;
  }
  .card {
    width: 360px; max-width: calc(100vw - 40px);
    padding: 40px 34px; border-radius: 22px; text-align: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(16px);
    box-shadow: 0 30px 70px rgba(8,2,30,0.5);
  }
  .logo-latam { height: 30px; width: auto; filter: brightness(0) invert(1); }
  .ttl { margin-top: 14px; font-weight: 700; font-size: 17px; letter-spacing: 0.16em; }
  .ttl span { color: #ff7a90; }
  .sub { margin: 6px 0 28px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; }
  .foot-logo { height: 16px; width: auto; filter: brightness(0) invert(1); opacity: 0.6; vertical-align: middle; }
  .foot-pre { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.4; margin-bottom: 8px; }
  input {
    width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08); color: #fff; font-size: 15px; outline: none; font-family: inherit;
  }
  input:focus { border-color: #ff4f6d; }
  input::placeholder { color: rgba(255,255,255,0.45); }
  button {
    width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 12px;
    background: #ff4f6d; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  button:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(255,79,109,0.4); }
  .err { margin-top: 16px; font-size: 13px; color: #ff9db0; min-height: 18px; }
  .foot { margin-top: 26px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.45; }
</style></head>
<body>
  <form class="card" method="POST" autocomplete="off">
    <img class="logo-latam" src="/latam360/assets/latam-logo.svg" alt="LATAM" />
    <div class="ttl">360<span>°</span> EXPERIENCE</div>
    <div class="sub">Experiencia inmersiva · Demo</div>
    <input type="password" name="key" placeholder="Clave de acceso" autofocus />
    <button type="submit">Entrar</button>
    <div class="err">${failed ? 'Clave incorrecta. Inténtalo de nuevo.' : ''}</div>
    <div class="foot">
      <div class="foot-pre">Una experiencia de</div>
      <img class="foot-logo" src="/latam360/assets/doppel-logo.png" alt="Doppel" />
    </div>
  </form>
</body></html>`;
  return new Response(html, {
    status: failed ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
