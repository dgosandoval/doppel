// fx3d — mundo de partículas scroll-driven detrás de las secciones oscuras.
// El scroll interpola entre 4 formaciones (nebulosa → onda de audio → terreno
// 3D → esfera de puntos), como guiño directo al Lab. Vanilla ES module.
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = window.matchMedia('(max-width: 720px)').matches;
const N = MOBILE ? 9000 : 26000;

// Paleta Doppel: naranja, crema, cian lab, amarillo pod
const THEMES = [
  [new THREE.Color('#FF6633'), new THREE.Color('#F4EFE6')], // nebulosa
  [new THREE.Color('#F4B81C'), new THREE.Color('#FF6633')], // onda (podcast)
  [new THREE.Color('#4FD8C7'), new THREE.Color('#2a7f76')], // terreno (lab)
  [new THREE.Color('#F4EFE6'), new THREE.Color('#4FD8C7')], // esfera (apps)
];

function buildShapes() {
  const shapes = [[], [], [], []];
  for (let i = 0; i < N; i++) {
    // 0 — nebulosa espiral
    {
      const arm = i % 3, t = Math.random();
      const r = 2.2 * Math.pow(t, 0.6) + 0.15;
      const a = arm * (Math.PI * 2 / 3) + t * 4.2 + (Math.random() - 0.5) * 0.45;
      shapes[0].push(
        Math.cos(a) * r,
        (Math.random() - 0.5) * (0.5 - t * 0.35),
        Math.sin(a) * r - 0.4
      );
    }
    // 1 — forma de onda de audio (cintas de sinusoides)
    {
      const row = i % 9, t = (i / N) * 2 - 1;
      const x = t * 4.2;
      const env = Math.exp(-x * x * 0.16);
      const y = Math.sin(x * 6 + row * 0.7) * env * (0.9 - row * 0.06);
      shapes[1].push(x, y, (row - 4) * 0.16 + (Math.random() - 0.5) * 0.05);
    }
    // 2 — terreno / malla topográfica
    {
      const cols = Math.floor(Math.sqrt(N * 16 / 9));
      const rows = Math.ceil(N / cols);
      const cx = i % cols, cy = Math.floor(i / cols);
      const x = (cx / cols - 0.5) * 5.6;
      const z = (cy / rows - 0.5) * 3.2;
      const y = Math.sin(x * 1.7) * Math.cos(z * 2.1) * 0.45
        + Math.sin(x * 4.2 + z * 3.1) * 0.16 - 0.5;
      shapes[2].push(x, y, z);
    }
    // 3 — esfera de fibonacci
    {
      const k = i + 0.5;
      const phi = Math.acos(1 - 2 * k / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      const r = 1.55 + (Math.random() < 0.06 ? Math.random() * 0.5 : 0);
      shapes[3].push(
        Math.cos(theta) * Math.sin(phi) * r,
        Math.cos(phi) * r,
        Math.sin(theta) * Math.sin(phi) * r
      );
    }
  }
  return shapes.map(s => new Float32Array(s));
}

function init() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fx3d';
  document.body.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 40);
  camera.position.set(0, 0.2, 4.6);

  const shapes = buildShapes();
  const pos = new Float32Array(shapes[0]);       // posiciones vivas
  const col = new Float32Array(N * 3);
  const phase = new Float32Array(N);
  for (let i = 0; i < N; i++) phase[i] = Math.random() * Math.PI * 2;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: MOBILE ? 0.02 : 0.016,
    vertexColors: true,
    transparent: true,
    opacity: MOBILE ? 0.4 : 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));

  let w = 0, h = 0;
  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Scroll → progreso 0..1 → índice de forma 0..3
  let scrollP = 0;
  function onScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - h);
    scrollP = Math.min(1, Math.max(0, window.scrollY / max));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Parallax de mouse (desactivado en móvil)
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  if (!MOBILE) {
    window.addEventListener('pointermove', (e) => {
      tmx = (e.clientX / w - 0.5) * 2;
      tmy = (e.clientY / h - 0.5) * 2;
    }, { passive: true });
  }

  const cA = new THREE.Color(), cB = new THREE.Color(), cA2 = new THREE.Color(), cB2 = new THREE.Color();
  const smooth = (t) => t * t * (3 - 2 * t);

  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  let last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!running) return;
    if (now - last < 1000 / 60) return;
    last = now;
    const time = now * 0.001;

    const f = scrollP * 3;                      // 0..3
    const idx = Math.min(2, Math.floor(f));
    const t = smooth(Math.min(1, f - idx));
    const A = shapes[idx], B = shapes[idx + 1];

    // Colores del tema interpolados
    cA.copy(THEMES[idx][0]).lerp(THEMES[idx + 1][0], t);
    cB.copy(THEMES[idx][1]).lerp(THEMES[idx + 1][1], t);

    const wob = REDUCED ? 0 : 0.035;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const s = Math.sin(time * 0.7 + phase[i]) * wob;
      pos[j]     = A[j]     + (B[j]     - A[j])     * t + s;
      pos[j + 1] = A[j + 1] + (B[j + 1] - A[j + 1]) * t + Math.cos(time * 0.55 + phase[i]) * wob;
      pos[j + 2] = A[j + 2] + (B[j + 2] - A[j + 2]) * t;
      // gradiente de color por partícula (mezcla estable por índice)
      const g = (i % 97) / 97;
      cA2.copy(cA).lerp(cB, g);
      col[j] = cA2.r; col[j + 1] = cA2.g; col[j + 2] = cA2.b;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;

    // Cámara: viaje suave con el scroll + parallax
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    const orbit = scrollP * Math.PI * 0.5;
    camera.position.x = Math.sin(orbit) * 1.1 + mx * 0.35;
    camera.position.y = 0.25 + scrollP * 0.5 - my * 0.25;
    camera.position.z = 4.6 - scrollP * 0.9;
    camera.lookAt(0, 0, 0);
    scene.rotation.y = REDUCED ? 0 : time * 0.02;
    // En el hero el texto domina: corre el mundo (a la derecha en desktop,
    // hacia abajo en móvil) y tráelo al centro a medida que se scrollea.
    const heroK = 1 - Math.min(1, scrollP * 3);
    scene.position.x = MOBILE ? 0 : -0.6 * heroK;
    scene.position.y = (MOBILE ? -1.5 : -1.05) * heroK;
    window.__fx3d = { p: scrollP, shape: idx, t };

    renderer.render(scene, camera);
  }

  if (REDUCED) {
    // Sin animación: un solo frame estático de la nebulosa
    const f = () => { renderer.render(scene, camera); };
    for (let i = 0; i < N * 3; i++) pos[i] = shapes[0][i];
    for (let i = 0; i < N; i++) {
      const j = i * 3, g = (i % 97) / 97;
      cA2.copy(THEMES[0][0]).lerp(THEMES[0][1], g);
      col[j] = cA2.r; col[j + 1] = cA2.g; col[j + 2] = cA2.b;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    f();
    window.addEventListener('resize', f);
  } else {
    requestAnimationFrame(frame);
  }
}

try { init(); } catch (e) { /* WebGL no disponible: el sitio funciona igual */ }
