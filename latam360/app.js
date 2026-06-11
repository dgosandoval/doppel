// LATAM 360 — visor de Gaussian Splatting (demo Doppel)
// Carga los splats POR REFERENCIA desde los hosts de PlayCanvas (no se descargan).
// downtown = streaming LOD/SOG (port limpio). Las demás escenas = ejemplos oficiales
// de PlayCanvas (MIT) cargados como módulos, con rutas de assets reescritas a absolutas.
import * as pc from 'playcanvas';
import { CameraControls } from 'playcanvas/scripts/esm/camera-controls.mjs';
import { GsplatRevealRadial } from 'playcanvas/scripts/esm/gsplat/reveal-radial.mjs';

const CTX_URL = '/latam360/lib/context.mjs';

// ---------------------------------------------------------------------------
// Catálogo de escenas
// ---------------------------------------------------------------------------
const SCENES = [
  {
    id: 'downtown',
    type: 'lod',
    name: 'Centro histórico',
    place: 'Lublin · Polonia',
    tag: '250M splats · streaming',
    desc: 'Una ciudad real reconstruida en 3D que recorres en tiempo real. Vuela entre las calles con el mouse y WASD.',
    credit: 'Escaneo: Andrii Shramko / Teleportour',
    urls: [
      'https://code.playcanvas.com/examples_data/downtown_01/ssog0/lod-meta.json',
      'https://code.playcanvas.com/examples_data/downtown_01/ssog1/lod-meta.json',
      'https://code.playcanvas.com/examples_data/downtown_01/ssog2/lod-meta.json',
      'https://code.playcanvas.com/examples_data/downtown_01/ssog3/lod-meta.json'
    ],
    skyUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kloofendal_48d_partly_cloudy_puresky_2k.hdr',
    sceneRotation: [-90, 0, 0],
    lodUpdateDistance: 4,
    lodUnderfillLimit: 5,
    lodBaseDistance: 20,
    moveSpeed: 13,
    moveFastSpeed: 100,
    cameraPosition: [-87.42, -14.23, 179.97],
    cameraRotation: [-14.85, -64.12, 0]
  },
  {
    id: 'first-person',
    type: 'module',
    module: 'first-person.mjs',
    name: 'Primera persona',
    place: 'Sunnyvale · EE.UU.',
    tag: 'Caminata · colisiones',
    desc: 'Recorre la escena a pie, en primera persona, con colisiones reales. WASD para moverte, mouse para mirar.',
    credit: 'Escaneo: superspl.at · CC BY 4.0'
  },
  {
    id: 'lod-streaming',
    type: 'module',
    module: 'lod-streaming.mjs',
    name: 'Streaming LOD',
    place: 'Parroquia romana',
    tag: 'Niveles de detalle',
    desc: 'Un escaneo enorme servido por niveles de detalle: carga progresiva según te acercas. Cielos HDRI intercambiables.',
    credit: 'Escaneo: Andrii Shramko'
  },
  {
    id: 'reveal',
    type: 'module',
    module: 'reveal.mjs',
    name: 'Reveal',
    place: 'Hotel · escultura',
    tag: 'Efectos de aparición',
    desc: 'Aparición cinematográfica del splat con efectos animados (radial, lluvia, erupción). Órbita con el mouse.',
    credit: 'Escaneo: superspl.at'
  },
  {
    id: 'splat-portal',
    type: 'module',
    module: 'splat-portal.mjs',
    name: 'Portal',
    place: 'Dos mundos',
    tag: 'Portal · stencil',
    desc: 'Un portal 3D conecta dos escaneos distintos: cruza de un mundo al otro. Efecto de recorte por stencil.',
    credit: 'Escaneos: Andrii Shramko / schindelar3d'
  }
];

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const loaderEl = () => $('#loader');
const loaderTextEl = () => $('#loader-text');

function showLoader(text) {
  loaderTextEl().textContent = text || 'Cargando experiencia…';
  loaderEl().classList.remove('hidden');
}
function hideLoader() {
  loaderEl().classList.add('hidden');
}
function showError(msg) {
  loaderTextEl().innerHTML = msg;
  loaderEl().classList.remove('hidden');
  loaderEl().classList.add('is-error');
}

function setActiveScene(scene) {
  document.querySelectorAll('.scene-card').forEach((el) => {
    el.classList.toggle('active', el.dataset.scene === scene.id);
  });
  $('#info-name').textContent = scene.name;
  $('#info-place').textContent = scene.place;
  $('#info-desc').textContent = scene.desc;
  $('#info-credit').textContent = scene.credit;
  $('#hint').textContent =
    scene.type === 'lod' || scene.id === 'first-person'
      ? 'Arrastra para mirar · WASD para moverte'
      : 'Arrastra para orbitar · rueda para acercar';
}

// Stub local de `data` para el port de downtown (independiente del shim de los módulos).
function makeData() {
  const store = {};
  const listeners = {};
  return {
    set(k, v) {
      store[k] = v;
      (listeners[`${k}:set`] || []).forEach((f) => f(undefined, k, v));
    },
    get(k) {
      return store[k];
    },
    on(ev, fn) {
      (listeners[ev] = listeners[ev] || []).push(fn);
    }
  };
}

// ---------------------------------------------------------------------------
// Ciclo de vida
// ---------------------------------------------------------------------------
let currentApp = null;
let currentAerial = null; // controlador de cámara aérea de la escena actual (solo downtown)
let currentSceneId = null;
let moduleVersion = 0;

function freshCanvas() {
  const old = document.getElementById('application-canvas');
  const c = document.createElement('canvas');
  c.id = 'application-canvas';
  old.replaceWith(c);
  return c;
}

// Elimina el DOM que inyectan los ejemplos (paneles, stats, etc.) al salir de la escena.
function cleanInjectedDom() {
  const keepClass = ['topbar', 'sidebar', 'info', 'hint'];
  const keepId = ['application-canvas', 'loader', 'tour-btn', 'tour-audio'];
  Array.from(document.body.children).forEach((el) => {
    if (el.tagName === 'SCRIPT') return;
    if (keepId.includes(el.id)) return;
    if (keepClass.some((c) => el.classList.contains(c))) return;
    el.remove();
  });
}

function teardown() {
  // Detiene el movimiento de cámara de la escena, pero NO la música:
  // el recorrido global mantiene el audio sonando entre escenas.
  if (currentAerial) {
    try {
      currentAerial.stop();
    } catch (e) {
      /* noop */
    }
    currentAerial = null;
  }
  if (currentApp) {
    try {
      currentApp.destroy();
    } catch (e) {
      /* noop */
    }
    currentApp = null;
  }
  cleanInjectedDom();
  window.__l360 = null;
}

async function makeApp(canvas) {
  const device = await pc.createGraphicsDevice(canvas, {
    deviceTypes: ['webgpu', 'webgl2'],
    antialias: false
  });

  const createOptions = new pc.AppOptions();
  createOptions.graphicsDevice = device;
  createOptions.mouse = new pc.Mouse(canvas);
  createOptions.touch = new pc.TouchDevice(canvas);
  createOptions.keyboard = new pc.Keyboard(window);
  createOptions.componentSystems = [
    pc.RenderComponentSystem,
    pc.CameraComponentSystem,
    pc.LightComponentSystem,
    pc.ScriptComponentSystem,
    pc.GSplatComponentSystem
  ];
  createOptions.resourceHandlers = [
    pc.TextureHandler,
    pc.ContainerHandler,
    pc.ScriptHandler,
    pc.GSplatHandler
  ];

  const app = new pc.AppBase(canvas);
  app.init(createOptions);
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  const applyResolution = () => {
    const dpr = window.devicePixelRatio || 1;
    device.maxPixelRatio = dpr >= 2 ? dpr * 0.5 : dpr;
  };
  applyResolution();
  const resize = () => {
    applyResolution();
    app.resizeCanvas();
  };
  window.addEventListener('resize', resize);
  app.on('destroy', () => window.removeEventListener('resize', resize));

  return { app, device };
}

// ---------------------------------------------------------------------------
// Escena de ciudad (streaming LOD/SOG) — port de downtown.example.mjs (MIT)
// ---------------------------------------------------------------------------
async function loadLod(scene) {
  const canvas = freshCanvas();
  const { app, device } = await makeApp(canvas);
  currentApp = app;
  const data = makeData();

  const assets = {
    ssog0: new pc.Asset('ssog0', 'gsplat', { url: scene.urls[0] }),
    ssog1: new pc.Asset('ssog1', 'gsplat', { url: scene.urls[1] }),
    ssog2: new pc.Asset('ssog2', 'gsplat', { url: scene.urls[2] }),
    ssog3: new pc.Asset('ssog3', 'gsplat', { url: scene.urls[3] }),
    sky: new pc.Asset('hdri', 'texture', { url: scene.skyUrl }, { mipmaps: false })
  };

  const loader = new pc.AssetListLoader(Object.values(assets), app.assets);
  await new Promise((resolve, reject) => {
    loader.load((err) => (err ? reject(err) : resolve()));
  });

  app.start();

  const pieces = [assets.ssog0, assets.ssog1, assets.ssog2, assets.ssog3];

  app.scene.gsplat.lodUpdateAngle = 90;
  app.scene.gsplat.lodBehindPenalty = 3;
  app.scene.gsplat.radialSorting = true;
  app.scene.gsplat.lodUpdateDistance = scene.lodUpdateDistance;
  app.scene.gsplat.lodUnderfillLimit = scene.lodUnderfillLimit;
  app.scene.gsplat.minPixelSize = 2;
  app.scene.gsplat.alphaClipForward = 1 / 255;
  app.scene.gsplat.minContribution = 3;
  app.scene.gsplat.dataFormat = pc.GSPLATDATA_COMPACT;
  app.scene.gsplat.renderer = device.isWebGPU
    ? pc.GSPLAT_RENDERER_RASTER_GPU_SORT
    : pc.GSPLAT_RENDERER_RASTER_CPU_SORT;

  const root = new pc.Entity('downtown');
  root.setLocalEulerAngles(scene.sceneRotation[0], scene.sceneRotation[1], scene.sceneRotation[2]);
  app.root.addChild(root);

  const gsInstances = [];
  let lodLevels = 1;
  for (let i = 0; i < pieces.length; i++) {
    const entity = new pc.Entity(`${scene.id}-${i}`);
    entity.addComponent('gsplat', { asset: pieces[i] });
    root.addChild(entity);
    gsInstances.push(/** @type {any} */ (entity.gsplat));
    const res = /** @type {any} */ (pieces[i].resource);
    lodLevels = Math.max(lodLevels, res.octree?.lodLevels ?? 1);
  }

  const worldAabb = new pc.BoundingBox();
  root.children.forEach((entity, i) => {
    const res = /** @type {any} */ (pieces[i].resource);
    const b = new pc.BoundingBox();
    b.setFromTransformedAabb(res.aabb, entity.getWorldTransform());
    if (i === 0) worldAabb.copy(b);
    else worldAabb.add(b);
  });
  const center = worldAabb.center.clone();
  const radius = worldAabb.halfExtents.length();

  // Reveal cinematográfico radial
  const camStart = new pc.Vec3(scene.cameraPosition[0], scene.cameraPosition[1], scene.cameraPosition[2]);
  const revealReach = camStart.distance(center) + radius;
  const revealHost = /** @type {any} */ (root.children[0]);
  revealHost.addComponent('script');
  const reveal = /** @type {any} */ (revealHost.script.create(GsplatRevealRadial));
  reveal.center.copy(camStart);
  reveal.endRadius = revealReach * 1.1;
  reveal.speed = (revealReach * 1.1) / 3;
  reveal.acceleration = 0;
  reveal.delay = 0;
  reveal.bandWidth = 10;
  reveal.oscillationIntensity = 0.2;
  reveal.dotTint.set(0, 0, 0);
  reveal.waveTint.set(5, 0, 0);
  let revealStarted = false;

  const skyboxCubemap = pc.EnvLighting.generateSkyboxCubemap(assets.sky.resource, 1024);
  app.scene.sky.type = pc.SKYTYPE_INFINITE;

  const worstLod = lodLevels - 1;
  app.scene.gsplat.lodRangeMin = Math.max(0, worstLod - 3);
  app.scene.gsplat.lodRangeMax = worstLod;
  const gsplatSystem = /** @type {any} */ (app.systems.gsplat);
  const onFrameReady = (cam, layer, ready, loadingCount) => {
    if (ready && loadingCount === 0) {
      gsplatSystem.off('frame:ready', onFrameReady);
      app.scene.gsplat.lodRangeMin = 0;
      app.scene.gsplat.lodRangeMax = worstLod;
      app.scene.skybox = skyboxCubemap;
      revealStarted = true;
      reveal.effectTime = 0;
      hideLoader();
    }
  };
  gsplatSystem.on('frame:ready', onFrameReady);

  const camera = new pc.Entity('camera');
  camera.addComponent('camera', {
    clearColor: new pc.Color(0.1, 0.11, 0.13),
    fov: 75,
    toneMapping: pc.TONEMAP_LINEAR,
    farClip: Math.max(10000, radius * 20)
  });
  camera.setLocalPosition(scene.cameraPosition[0], scene.cameraPosition[1], scene.cameraPosition[2]);
  camera.setLocalEulerAngles(scene.cameraRotation[0], scene.cameraRotation[1], scene.cameraRotation[2]);
  app.root.addChild(camera);

  const focusPoint = camera.forward.clone().mulScalar(radius * 0.5).add(camera.getPosition());
  camera.addComponent('script');
  const cc = /** @type {any} */ (camera.script.create(CameraControls));
  Object.assign(cc, {
    sceneSize: radius,
    moveSpeed: scene.moveSpeed,
    moveFastSpeed: scene.moveFastSpeed,
    moveDamping: 0.997,
    enableOrbit: false,
    enablePan: false,
    focusPoint
  });

  const budget = pc.platform.mobile ? 4 : 8;
  app.scene.gsplat.splatBudget = Math.round(budget * 1000000);
  for (let i = 0; i < gsInstances.length; i++) {
    gsInstances[i].lodBaseDistance = scene.lodBaseDistance;
    gsInstances[i].lodMultiplier = 1.5;
  }

  // --- Recorrido automático (vuelo aéreo orbital) + música ---
  const tourCenter = center.clone();
  const tourR = Math.max(radius * 0.85, 30);
  const tourH = center.y + radius * 0.5;
  let tourAngle = Math.atan2(
    scene.cameraPosition[2] - center.z,
    scene.cameraPosition[0] - center.x
  );
  let tourActive = false;
  let tourTime = 0;
  const tourStartPos = new pc.Vec3();
  const tourTmp = new pc.Vec3();

  // Movimiento de cámara aéreo (lo arranca/detiene el recorrido global).
  currentAerial = {
    start() {
      tourActive = true;
      tourTime = 0;
      tourStartPos.copy(camera.getPosition());
      cc.enabled = false;
    },
    stop() {
      tourActive = false;
      cc.enabled = true;
    }
  };

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  app.on('update', (dt) => {
    if (!revealStarted) reveal.effectTime = -1e6;
    if (!tourActive) return;
    tourTime += dt;
    tourAngle += dt * 0.05; // ~125 s por vuelta
    tourTmp.set(
      tourCenter.x + Math.cos(tourAngle) * tourR,
      tourH,
      tourCenter.z + Math.sin(tourAngle) * tourR
    );
    if (tourTime < 3) {
      // Transición suave desde la posición actual hacia el vuelo aéreo.
      const t = easeInOut(tourTime / 3);
      tourTmp.lerp(tourStartPos, tourTmp, t);
    }
    camera.setPosition(tourTmp);
    camera.lookAt(tourCenter);
  });

  setTimeout(() => hideLoader(), 15000);
}

// ---------------------------------------------------------------------------
// Escenas de ejemplo (módulos PlayCanvas adaptados)
// ---------------------------------------------------------------------------
async function loadModule(scene) {
  freshCanvas();

  // Limpia el estado compartido del shim antes de cargar.
  try {
    const ctx = await import(CTX_URL);
    if (ctx.reset) ctx.reset();
  } catch (e) {
    /* noop */
  }

  let hidden = false;
  const hide = () => {
    if (!hidden) {
      hidden = true;
      hideLoader();
    }
  };

  window.__l360 = {
    register(app) {
      currentApp = app;
      // Ocultar el loader cuando empiece a renderizar.
      app.on('postrender', hide);
    }
  };

  moduleVersion += 1;
  await import(`/latam360/scenes/${scene.module}?v=${moduleVersion}`);

  // Salvavidas por si el módulo no llega a registrar/renderizar.
  setTimeout(hide, 15000);
}

// ---------------------------------------------------------------------------
// Orquestación
// ---------------------------------------------------------------------------
async function selectScene(scene) {
  currentSceneId = scene.id;
  setActiveScene(scene);
  loaderEl().classList.remove('is-error');
  showLoader(scene.type === 'lod' ? 'Transmitiendo la ciudad…' : 'Cargando experiencia…');
  teardown();
  try {
    if (scene.type === 'lod') await loadLod(scene);
    else await loadModule(scene);
  } catch (err) {
    console.error('[latam360] error cargando escena', scene.id, err);
    showError(
      `No se pudo cargar <b>${scene.name}</b>.<br><span style="opacity:.7;font-size:13px">` +
        `${(err && err.message) || err}</span><br><br>` +
        `<span style="opacity:.7;font-size:13px">Prueba otra experiencia del menú.</span>`
    );
  }
}

function buildSceneMenu() {
  const menu = $('#scenes');
  SCENES.forEach((scene) => {
    const card = document.createElement('button');
    card.className = 'scene-card';
    card.dataset.scene = scene.id;
    card.innerHTML = `
      <span class="scene-card__name">${scene.name}</span>
      <span class="scene-card__place">${scene.place}</span>
      <span class="scene-card__tag">${scene.tag}</span>`;
    card.addEventListener('click', () => selectScene(scene));
    menu.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// Recorrido completo: avanza automáticamente por todas las escenas (30 s c/u)
// con la música sonando de forma continua (no se detiene entre escenas).
// ---------------------------------------------------------------------------
const SCENE_DWELL_MS = 30000;

const grandTour = {
  active: false,
  _timer: null,
  start() {
    if (this.active) return;
    this.active = true;
    const audio = document.getElementById('tour-audio');
    if (audio) audio.play().catch(() => {});
    this._updateBtn(true);
    this._runCurrent();
  },
  stop() {
    this.active = false;
    clearTimeout(this._timer);
    if (currentAerial) {
      try {
        currentAerial.stop();
      } catch (e) {
        /* noop */
      }
    }
    const audio = document.getElementById('tour-audio');
    if (audio) audio.pause();
    this._updateBtn(false);
  },
  toggle() {
    if (this.active) this.stop();
    else this.start();
  },
  _runCurrent() {
    if (!this.active) return;
    if (currentAerial) {
      try {
        currentAerial.start();
      } catch (e) {
        /* noop */
      }
    }
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._advance(), SCENE_DWELL_MS);
  },
  async _advance() {
    if (!this.active) return;
    const idx = SCENES.findIndex((s) => s.id === currentSceneId);
    const next = SCENES[(idx + 1) % SCENES.length];
    await selectScene(next);
    if (!this.active) return;
    this._runCurrent();
  },
  _updateBtn(active) {
    const btn = document.getElementById('tour-btn');
    if (!btn) return;
    btn.classList.toggle('active', active);
    const label = btn.querySelector('.tour-btn__label');
    const icon = btn.querySelector('.tour-btn__icon');
    if (label) label.textContent = active ? 'Detener recorrido' : 'Iniciar recorrido';
    if (icon) icon.textContent = active ? '⏸' : '▶';
  }
};

function setupTourButton() {
  const btn = document.getElementById('tour-btn');
  if (!btn) return;
  btn.hidden = false;
  btn.addEventListener('click', () => grandTour.toggle());
}

function boot() {
  buildSceneMenu();
  setupTourButton();
  selectScene(SCENES[0]);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
