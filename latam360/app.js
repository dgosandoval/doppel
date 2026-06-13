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
    dwellMs: 24000, // excepción: su locución de bienvenida dura ~22 s (el resto va a 20 s)
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
    id: 'lod-streaming',
    type: 'module',
    module: 'lod-streaming.mjs',
    name: 'Streaming LOD',
    place: 'Parroquia romana',
    tag: 'Niveles de detalle',
    desc: 'Un escaneo enorme servido por niveles de detalle: carga progresiva según te acercas. Cielos HDRI intercambiables.',
    credit: 'Escaneo: Andrii Shramko',
    tourMode: 'dolly',
    tourSpeed: 0.8,
    tourDist: 26,
    tourYawDeg: 65,
    tourCurve: true,
    preload: ['https://code.playcanvas.com/examples_data/example_roman_parish_02/lod-meta.json']
  },
  {
    id: 'first-person',
    type: 'module',
    module: 'first-person.mjs',
    name: 'Primera persona',
    place: 'Sunnyvale · EE.UU.',
    tag: 'Caminata · colisiones',
    desc: 'Recorre la escena a pie, en primera persona, con colisiones reales. WASD para moverte, mouse para mirar.',
    credit: 'Escaneo: superspl.at · CC BY 4.0',
    // Avanza RECTO; solo gira la vista a la izquierda (sin alterar la trayectoria).
    tourMode: 'dolly',
    tourSpeed: 0.7,
    tourDist: 18,
    tourYawDeg: -60,
    preload: [
      '/latam360/assets/splats/sunnyvale-lite.sog',
      'https://code.playcanvas.com/examples_data/example_sunnyvale/sunnyvale.glb'
    ]
  },
  {
    id: 'reveal',
    type: 'module',
    module: 'reveal.mjs',
    name: 'Reveal',
    place: 'Hotel · escultura',
    tag: 'Efectos de aparición',
    desc: 'Aparición cinematográfica del splat con efectos animados (radial, lluvia, erupción). Órbita con el mouse.',
    credit: 'Escaneo: superspl.at',
    tourMode: 'swing',
    preload: ['/latam360/assets/splats/hotel-lite.sog']
  },
  {
    id: 'splat-portal',
    type: 'module',
    module: 'splat-portal.mjs',
    name: 'Portal',
    place: 'Dos mundos',
    tag: 'Portal · stencil',
    desc: 'Un portal 3D conecta dos escaneos distintos: cruza de un mundo al otro. Efecto de recorte por stencil.',
    credit: 'Escaneos: Andrii Shramko / schindelar3d',
    // Avanza RECTO y cruza el portal mirando al frente; SOLO DESPUÉS de cruzarlo
    // (yawDelay) gira la vista ~160° para mirar el portal desde el otro lado.
    tourMode: 'dolly',
    tourSpeed: 1.4,
    tourDist: 16,
    tourYawDeg: -160,
    tourYawDelay: 11,
    tourYawDur: 8,
    preload: [
      'https://code.playcanvas.com/examples_data/example_roman_parish_02/lod-meta.json',
      'https://code.playcanvas.com/examples_data/example_skatepark_02/lod-meta.json'
    ]
  }
];

// Mensajes que van apareciendo (en tarjetas) durante el recorrido, por escena.
// Edita libremente estos textos. Acepta <b>negrita</b>.
const TOUR_MESSAGES = {
  downtown: [
    'Bienvenido a <b>LATAM 360°</b>',
    'Centro histórico de Lublin, reconstruido en 3D',
    'Vuela sobre la ciudad en tiempo real'
  ],
  'first-person': ['Camina dentro de la escena', 'Captura fotorrealista a escala real'],
  'lod-streaming': ['Escaneos servidos por niveles de detalle', 'Carga progresiva, sin esperas'],
  reveal: ['Aparición cinematográfica del splat', 'Volumen y detalle, sin mallas 3D'],
  'splat-portal': ['Un portal entre dos mundos', 'Realidades capturadas, conectadas']
};

// Locución del recorrido: clips por escena, con su instante de inicio (ms) dentro
// del turno de 30 s. El cierre (06) suena en el turno del portal, tras su clip.
const TOUR_VOICES = {
  downtown: [{ src: 'assets/voice/voice-01.mp3', at: 1500 }],
  'lod-streaming': [{ src: 'assets/voice/voice-02.mp3', at: 1500 }],
  'first-person': [{ src: 'assets/voice/voice-03.mp3', at: 1500 }],
  reveal: [{ src: 'assets/voice/voice-04.mp3', at: 1500 }],
  'splat-portal': [
    { src: 'assets/voice/voice-05.mp3', at: 1500 },
    { src: 'assets/voice/voice-06.mp3', at: 10000 }
  ]
};

// Volúmenes fijos. El ÚNICO control de volumen de la música es el propio archivo:
// tour-music.mp3 está renderizado al 25% del nivel original (mean -24.6 dB), así
// suena idéntico en TODAS las plataformas (iOS ignora los controles por código).
// Para ajustar el nivel: re-renderizar el archivo, no tocar estas constantes.
const MUSIC_VOL = 1.0;
const VOICE_VOL = 1.0;

// La música del tour se reproduce con un <audio> plano (NO Web Audio). El volumen
// ya está horneado en el archivo (-44.9 dB), así que no hace falta el GainNode que
// antes obligaba a usar Web Audio. Un <audio> es mucho más robusto en iOS: el
// AudioContext de Web Audio se "interrumpe" cuando cada escena recrea el contexto
// WebGL, cortando la música entre splats; el <audio> sigue sonando. Se arranca en
// el gesto del botón y `ensure()` lo reanuda si iOS llegara a pausarlo.
const musicPlayer = {
  active: false,
  _el: null,
  el() {
    if (!this._el) this._el = document.getElementById('tour-audio');
    return this._el;
  },
  start() {
    this.active = true;
    const el = this.el();
    if (!el) return;
    el.loop = true;
    el.preload = 'auto';
    el.volume = MUSIC_VOL; // 1.0 — iOS lo ignora, pero el nivel ya va en el archivo
    el.play().catch(() => {});
  },
  // Llamar tras cada transición de escena (y por keepalive): si iOS pausó el audio,
  // lo reanuda. No reinicia la pista si ya está sonando.
  ensure() {
    if (!this.active) return;
    const el = this.el();
    if (el && el.paused) el.play().catch(() => {});
  },
  stop() {
    this.active = false;
    const el = this.el();
    if (el) el.pause();
  }
};

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
  // Cuando la nueva escena ya pintó su primer frame, desvanece el overlay de
  // transición para revelarla con un fade limpio (en vez de un corte seco).
  sceneTransition.reveal();
}

// Overlay de transición (fade a indigo) entre escenas. Se cubre antes de cambiar
// de splat y se revela cuando la escena nueva está lista (vía hideLoader).
const sceneTransition = {
  el: null,
  _ensure() {
    if (this.el && document.body.contains(this.el)) return this.el;
    let d = document.getElementById('scene-transition');
    if (!d) {
      d = document.createElement('div');
      d.id = 'scene-transition';
      document.body.appendChild(d);
    }
    this.el = d;
    return d;
  },
  cover() {
    const d = this._ensure();
    void d.offsetWidth; // fuerza reflow para que el fade aplique aunque acabe de crearse
    d.classList.add('show');
    return new Promise((r) => setTimeout(r, 460));
  },
  reveal() {
    if (this.el) this.el.classList.remove('show');
  }
};
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
  const touch = pc.platform.mobile;
  let hint;
  if (scene.id === 'first-person') {
    hint = touch
      ? 'Desliza un dedo para avanzar · otro para mirar'
      : 'Arrastra para mirar · WASD para moverte';
  } else if (scene.type === 'lod') {
    hint = touch ? 'Desliza para explorar la ciudad' : 'Arrastra para mirar · WASD para moverte';
  } else {
    hint = touch ? 'Desliza para orbitar · pellizca para acercar' : 'Arrastra para orbitar · rueda para acercar';
  }
  $('#hint').textContent = hint;
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
  const keepId = ['application-canvas', 'loader', 'scene-transition', 'tour-btn', 'tour-audio', 'tour-voice', 'tour-caption'];
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

  // --- Recorrido: sube un poco y AVANZA hacia el centro de la ciudad ---
  const tourCenter = center.clone();
  const tourRise = radius * 0.18; // sube un poco
  let tourAdvReach = radius * 0.45;
  let tourActive = false;
  let tourTime = 0;
  const tourStartPos = new pc.Vec3();
  const tourStartFwd = new pc.Vec3();
  const tourFwdH = new pc.Vec3();
  const tourTmp = new pc.Vec3();
  const tourLook = new pc.Vec3();
  const tourLookDir = new pc.Vec3();

  currentAerial = {
    start() {
      tourActive = true;
      tourTime = 0;
      tourStartPos.copy(camera.getPosition());
      // Mirada inicial (la que ve el usuario al cargar): el recorrido arranca desde
      // aquí y migra suave hacia el centro, sin salto de perspectiva.
      tourStartFwd.copy(camera.forward).normalize();
      // Dirección horizontal hacia el centro de la ciudad (no hacia el borde).
      tourFwdH.set(tourCenter.x - tourStartPos.x, 0, tourCenter.z - tourStartPos.z);
      const distToCenter = tourFwdH.length();
      if (distToCenter < 1e-3) tourFwdH.set(0, 0, -1);
      tourFwdH.normalize();
      // Avanza hasta ~3/4 del camino al centro: termina sobre la ciudad.
      tourAdvReach = Math.max(20, distToCenter * 0.75);
      cc.enabled = false;
    },
    stop() {
      tourActive = false;
      cc.enabled = true;
    }
  };

  app.on('update', (dt) => {
    if (!revealStarted) reveal.effectTime = -1e6;
    if (!tourActive) return;
    tourTime += dt;
    const ph = tourTime * 0.06;
    const adv = tourAdvReach * ((1 - Math.cos(ph)) / 2); // avanza hacia adelante (acotado)
    const rise = tourRise * ((1 - Math.cos(ph)) / 2); // sube un poco a la par
    const sway = radius * 0.04 * Math.sin(tourTime * 0.04);
    tourTmp.copy(tourFwdH).mulScalar(adv).add(tourStartPos);
    tourTmp.x += -tourFwdH.z * sway;
    tourTmp.z += tourFwdH.x * sway;
    tourTmp.y = tourStartPos.y + rise;
    camera.setPosition(tourTmp);
    // Mira hacia adelante, al nivel de la ciudad. La dirección de mirada arranca en
    // la orientación inicial de la cámara (tourStartFwd) y migra hacia el centro en
    // ~2.5 s con suavizado — así no hay salto al iniciar el recorrido.
    tourLook.copy(tourFwdH).mulScalar(radius * 0.5).add(tourTmp);
    tourLook.y = tourCenter.y;
    tourLookDir.copy(tourLook).sub(tourTmp).normalize();
    const lb = Math.min(tourTime / 2.5, 1);
    const ls = lb * lb * (3 - 2 * lb); // smoothstep
    tourLookDir.lerp(tourStartFwd, tourLookDir, ls).normalize();
    tourLook.copy(tourLookDir).mulScalar(radius * 0.5).add(tourTmp);
    camera.lookAt(tourLook);
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
      // Rendimiento: limita la resolución de render (los splats son suaves; gran
      // ganancia de fluidez, sobre todo en escenas pesadas).
      try {
        const gd = app.graphicsDevice;
        gd.maxPixelRatio = Math.min(gd.maxPixelRatio || 2, pc.platform.mobile ? 1 : 1.25);
      } catch (e) {
        /* noop */
      }
      // Movimiento de cámara para el recorrido (dolly o swing).
      setupModuleAerial(app, scene.tourMode || 'dolly', {
        speed: scene.tourSpeed,
        dist: scene.tourDist,
        arc: scene.tourReach,
        yawDeg: scene.tourYawDeg,
        curve: scene.tourCurve,
        yawDelay: scene.tourYawDelay,
        yawDur: scene.tourYawDur
      });
    }
  };

  moduleVersion += 1;
  await import(`/latam360/scenes/${scene.module}?v=${moduleVersion}`);

  // Salvavidas por si el módulo no llega a registrar/renderizar.
  setTimeout(hide, 15000);
}

// Movimiento de cámara genérico para escenas de módulo durante el recorrido.
// Desactiva el script de control de la cámara (y sus ancestros — en first-person
// el controlador está en el entity padre) y conduce la cámara en 'update'.
//  'dolly' = avanza por el lugar (velocidad/distancia configurables, mirada estable).
//  'swing' = arco corto alrededor del objeto (se queda en el lado capturado).
function setupModuleAerial(app, mode, opts = {}) {
  let active = false;
  let ready = false;
  let cam = null;
  let time = 0;
  let baseDist = 8;
  let radius = 8;
  let baseH = 0;
  let startAngle = 0;
  let disabledScripts = [];
  let traveled = 0;
  const startPos = new pc.Vec3();
  const fwdH = new pc.Vec3();
  const startFwdFull = new pc.Vec3();
  const rightH = new pc.Vec3();
  const focus = new pc.Vec3();
  const tmp = new pc.Vec3();
  const look = new pc.Vec3();
  const pathPos = new pc.Vec3();
  const curDir = new pc.Vec3();

  const findCamera = () => {
    let c = null;
    app.root.forEach((e) => {
      if (e.camera) c = e;
    });
    return c;
  };

  const contentBox = () => {
    const aabb = new pc.BoundingBox();
    let has = false;
    app.root.forEach((e) => {
      const box = e.gsplat && e.gsplat.instance && e.gsplat.instance.aabb;
      if (box && box.halfExtents.length() > 0) {
        if (!has) {
          aabb.copy(box);
          has = true;
        } else {
          aabb.add(box);
        }
      }
    });
    return has ? aabb : null;
  };

  const disableControls = () => {
    disabledScripts = [];
    let e = cam;
    while (e) {
      if (e.script && e.script.enabled) {
        e.script.enabled = false;
        disabledScripts.push(e);
      }
      e = e.parent;
    }
  };
  const restoreControls = () => {
    disabledScripts.forEach((e) => {
      if (e.script) e.script.enabled = true;
    });
    disabledScripts = [];
  };

  const init = () => {
    disableControls();
    const p = cam.getPosition();
    startPos.copy(p);
    startFwdFull.copy(cam.forward).normalize();
    fwdH.set(cam.forward.x, 0, cam.forward.z);
    if (fwdH.length() < 1e-3) fwdH.set(0, 0, -1);
    fwdH.normalize();
    rightH.set(-fwdH.z, 0, fwdH.x);
    pathPos.copy(p);
    curDir.copy(fwdH);
    traveled = 0;
    const box = contentBox();
    let scaleR = 0;
    if (box) {
      focus.copy(box.center);
      scaleR = box.halfExtents.length();
    } else {
      // Fallback (escenas LOD cuyo aabb aún no está listo): promedio de posiciones gsplat.
      const avg = new pc.Vec3();
      let n = 0;
      app.root.forEach((e) => {
        if (e.gsplat) {
          avg.add(e.getPosition());
          n += 1;
        }
      });
      if (n) focus.copy(avg.mulScalar(1 / n));
      else focus.copy(fwdH).mulScalar(8).add(p);
    }
    radius = Math.max(2, Math.hypot(p.x - focus.x, p.z - focus.z));
    // Escala del movimiento: el mayor entre el tamaño de la escena y la distancia de visión.
    baseDist = Math.max(radius, scaleR);
    baseH = p.y;
    startAngle = Math.atan2(p.z - focus.z, p.x - focus.x);
  };

  app.on('update', (dt) => {
    if (!active) return;
    if (!ready) {
      cam = findCamera();
      if (!cam) return;
      init();
      ready = true;
    }
    const d = dt || 1 / 60;
    time += d;
    if (mode === 'swing') {
      const arc = opts.arc || 0.45;
      const ang = startAngle + arc * Math.sin(time * 0.18);
      const h = baseH + Math.sin(time * 0.3) * radius * 0.05;
      tmp.set(focus.x + Math.cos(ang) * radius, h, focus.z + Math.sin(ang) * radius);
      cam.setPosition(tmp);
      cam.lookAt(focus);
    } else {
      // dolly: avanza con velocidad/distancia explícitas. Con `curve`, el CAMINO
      // gira gradualmente (yawDeg); sin curve solo gira la mirada.
      const speed = opts.speed || Math.max(0.6, baseDist * 0.05);
      const maxD = opts.dist || baseDist * 0.6;
      // El giro de vista (yaw) puede RETRASARSE `yawDelay` s y durar `yawDur` s.
      // Así el portal se cruza RECTO mirando al frente y SOLO DESPUÉS gira la vista.
      const yawDelay = opts.yawDelay || 0;
      const yawDur = opts.yawDur || 18;
      const b = Math.min(Math.max(time - yawDelay, 0) / yawDur, 1);
      const yawNow = opts.yawDeg ? ((opts.yawDeg * Math.PI) / 180) * (b * b * (3 - 2 * b)) : 0;
      if (opts.curve && yawNow) {
        curDir.set(
          fwdH.x * Math.cos(yawNow) - fwdH.z * Math.sin(yawNow),
          0,
          fwdH.x * Math.sin(yawNow) + fwdH.z * Math.cos(yawNow)
        );
      } else {
        curDir.copy(fwdH);
      }
      if (traveled < maxD) {
        // arranque suave los primeros 2 s, luego velocidad constante
        const inst = speed * (time < 2 ? time / 2 : 1);
        const step = Math.min(inst * d, maxD - traveled);
        traveled += step;
        pathPos.add(tmp.copy(curDir).mulScalar(step));
      }
      const sway = Math.min(baseDist, maxD) * 0.03 * Math.sin(time * 0.08);
      tmp.copy(pathPos);
      tmp.x += -curDir.z * sway;
      tmp.z += curDir.x * sway;
      // Elevación opcional proporcional al avance (sobrevuela obstáculos).
      tmp.y = startPos.y + (opts.rise || 0) * (maxD > 0 ? traveled / maxD : 0);
      cam.setPosition(tmp);
      if (opts.curve && opts.yawDeg) {
        // La mirada sigue la dirección del camino (conservando la inclinación inicial).
        look.set(curDir.x, startFwdFull.y, curDir.z).normalize().mulScalar(20).add(tmp);
      } else if (opts.yawDeg) {
        const fx = startFwdFull.x * Math.cos(yawNow) - startFwdFull.z * Math.sin(yawNow);
        const fz = startFwdFull.x * Math.sin(yawNow) + startFwdFull.z * Math.cos(yawNow);
        look.set(fx, startFwdFull.y, fz).normalize().mulScalar(20).add(tmp);
      } else {
        look.copy(startFwdFull).mulScalar(20).add(tmp);
      }
      cam.lookAt(look);
    }
  });

  currentAerial = {
    start() {
      active = true;
      ready = false;
      time = 0;
    },
    stop() {
      active = false;
      restoreControls();
    }
  };
}

// ---------------------------------------------------------------------------
// Orquestación
// ---------------------------------------------------------------------------
let sceneShownOnce = false;
async function selectScene(scene) {
  currentSceneId = scene.id;
  setActiveScene(scene);
  loaderEl().classList.remove('is-error');
  // Primera carga: pantalla de carga con spinner. Cambios posteriores entre splats:
  // transición suave (fade a indigo) sin spinner, revelada al pintar la escena nueva.
  if (sceneShownOnce) {
    await sceneTransition.cover();
  } else {
    showLoader(scene.type === 'lod' ? 'Transmitiendo la ciudad…' : 'Cargando experiencia…');
  }
  teardown();
  try {
    if (scene.type === 'lod') await loadLod(scene);
    else await loadModule(scene);
    sceneShownOnce = true;
  } catch (err) {
    sceneTransition.reveal();
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
    // Elegir una escena a mano detiene el recorrido (música + locución + cámara),
    // para que no sigan sonando sobre una escena que el usuario eligió manualmente.
    card.addEventListener('click', () => {
      grandTour.stop();
      selectScene(scene);
    });
    menu.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// Recorrido completo: avanza automáticamente por todas las escenas (30 s c/u)
// con la música sonando de forma continua (no se detiene entre escenas).
// ---------------------------------------------------------------------------
const SCENE_DWELL_MS = 20000;
// Duración del turno de una escena (permite excepción por escena vía `dwellMs`).
function dwellFor(sceneId) {
  const s = SCENES.find((x) => x.id === sceneId);
  return (s && s.dwellMs) || SCENE_DWELL_MS;
}

// Precarga (warm cache) de los assets pesados de una escena, para que cuando
// el recorrido avance la siguiente escena no muestre una pantalla de carga larga.
const _preloaded = new Set();
function preloadScene(scene) {
  if (!scene || !scene.preload) return;
  scene.preload.forEach((url) => {
    if (_preloaded.has(url)) return;
    _preloaded.add(url);
    fetch(url, { mode: 'cors' })
      .then((r) => r.arrayBuffer())
      .catch(() => _preloaded.delete(url));
  });
}

// Tarjetas de mensajes que aparecen secuencialmente durante el turno de cada escena.
const captions = {
  _timers: [],
  showFor(sceneId) {
    this.clear();
    const el = document.getElementById('tour-caption');
    const msgs = TOUR_MESSAGES[sceneId];
    if (!el || !msgs || !msgs.length) return;
    const slot = dwellFor(sceneId) / msgs.length;
    msgs.forEach((m, i) => {
      const start = i * slot + 1200;
      this._timers.push(
        setTimeout(() => {
          el.innerHTML = m;
          el.classList.add('show');
        }, start)
      );
      this._timers.push(setTimeout(() => el.classList.remove('show'), start + slot - 1400));
    });
  },
  clear() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
    const el = document.getElementById('tour-caption');
    if (el) el.classList.remove('show');
  }
};

// Locución por escena: agenda los clips del turno (voz al 100%, música fija al 30%).
const voiceover = {
  _timers: [],
  showFor(sceneId) {
    this.clear();
    const clips = TOUR_VOICES[sceneId];
    const voice = document.getElementById('tour-voice');
    if (!voice || !clips || !clips.length) return;
    voice.volume = VOICE_VOL;
    clips.forEach((clip) => {
      this._timers.push(
        setTimeout(() => {
          voice.src = clip.src;
          voice.currentTime = 0;
          voice.volume = VOICE_VOL;
          voice.play().catch(() => {});
        }, clip.at)
      );
    });
  },
  clear() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
    const voice = document.getElementById('tour-voice');
    if (voice) voice.pause();
  }
};

const grandTour = {
  active: false,
  _timer: null,
  _keepalive: null,
  start() {
    if (this.active) return;
    if (gyroMode.active) gyroMode.disable(); // recorrido y vista AR son excluyentes
    this.active = true;
    document.body.classList.add('touring'); // oculta el hint de controles durante el recorrido
    musicPlayer.start();
    // Keepalive: en iOS el AudioContext se suspende al cambiar de escena; lo
    // reanudamos periódicamente para que la música no se corte entre splats.
    clearInterval(this._keepalive);
    this._keepalive = setInterval(() => musicPlayer.ensure(), 1500);
    this._updateBtn(true);
    this._runCurrent();
  },
  stop() {
    this.active = false;
    document.body.classList.remove('touring');
    clearTimeout(this._timer);
    clearInterval(this._keepalive);
    captions.clear();
    voiceover.clear();
    if (currentAerial) {
      try {
        currentAerial.stop();
      } catch (e) {
        /* noop */
      }
    }
    musicPlayer.stop();
    this._updateBtn(false);
  },
  toggle() {
    if (this.active) this.stop();
    else this.start();
  },
  _runCurrent() {
    if (!this.active) return;
    musicPlayer.ensure(); // tras la transición, reanuda el audio si iOS lo suspendió
    if (currentAerial) {
      try {
        currentAerial.start();
      } catch (e) {
        /* noop */
      }
    }
    // Mensajes en tarjetas y locución para esta escena.
    captions.showFor(currentSceneId);
    voiceover.showFor(currentSceneId);
    // Precarga la siguiente escena durante este turno (30 s de margen).
    const idx = SCENES.findIndex((s) => s.id === currentSceneId);
    preloadScene(SCENES[(idx + 1) % SCENES.length]);
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._advance(), dwellFor(currentSceneId));
  },
  async _advance() {
    if (!this.active) return;
    const idx = SCENES.findIndex((s) => s.id === currentSceneId);
    // Tras el último splat: terminar el recorrido (para música/locución/cámara,
    // muestra de nuevo el menú) y volver al primero en modo libre.
    if (idx === SCENES.length - 1) {
      this.stop();
      await selectScene(SCENES[0]);
      return;
    }
    const next = SCENES[idx + 1];
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

// ---------------------------------------------------------------------------
// Modo "Vista AR": mirar alrededor moviendo el teléfono (giroscopio). Solo mobile.
// Toma la cámara de la escena actual, desactiva su control y la orienta según el
// sensor. Posición fija (miras desde donde estás). NOTA: el mapeo orientación→
// cámara es el cálculo estándar (port de THREE DeviceOrientationControls); puede
// requerir ajuste fino de signos según el dispositivo.
// ---------------------------------------------------------------------------
const gyroMode = {
  active: false,
  _have: false,
  _alpha: 0,
  _beta: 0,
  _gamma: 0,
  _cam: null,
  _disabled: [],
  _raf: 0,
  _onOrient: null,
  _q: null,
  available() {
    return typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';
  },
  async toggle() {
    if (this.active) this.disable();
    else await this.enable();
  },
  async enable() {
    try {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        const res = await DOE.requestPermission();
        if (res !== 'granted') {
          $('#hint').textContent = 'Permiso de movimiento denegado';
          return;
        }
      }
    } catch (e) {
      $('#hint').textContent = 'No se pudo activar la vista AR';
      return;
    }
    if (grandTour.active) grandTour.stop(); // el modo AR es de exploración libre
    if (!this._q) {
      this._q = new pc.Quat();
      this._qx = new pc.Quat();
      this._qy = new pc.Quat();
      this._qz = new pc.Quat();
      this._q1 = new pc.Quat();
      this._q0 = new pc.Quat();
      this._axX = new pc.Vec3(1, 0, 0);
      this._axY = new pc.Vec3(0, 1, 0);
      this._axZ = new pc.Vec3(0, 0, 1);
    }
    this._onOrient = (e) => {
      if (e.alpha == null) return;
      this._alpha = e.alpha;
      this._beta = e.beta || 0;
      this._gamma = e.gamma || 0;
      this._have = true;
    };
    window.addEventListener('deviceorientation', this._onOrient, true);
    this.active = true;
    document.body.classList.add('gyro-on');
    this._updateBtn(true);
    this._loop();
  },
  disable() {
    this.active = false;
    if (this._onOrient) window.removeEventListener('deviceorientation', this._onOrient, true);
    this._onOrient = null;
    cancelAnimationFrame(this._raf);
    this._restore();
    this._cam = null;
    this._have = false;
    document.body.classList.remove('gyro-on');
    this._updateBtn(false);
  },
  _findCam() {
    if (!currentApp) return null;
    let c = null;
    currentApp.root.forEach((e) => {
      if (e.camera) c = e;
    });
    return c;
  },
  _disableControls(cam) {
    this._restore();
    let e = cam;
    while (e) {
      if (e.script && e.script.enabled) {
        e.script.enabled = false;
        this._disabled.push(e);
      }
      e = e.parent;
    }
  },
  _restore() {
    this._disabled.forEach((e) => {
      if (e.script) e.script.enabled = true;
    });
    this._disabled = [];
  },
  _screenAngle() {
    const so = screen.orientation && screen.orientation.angle;
    return so != null ? so : window.orientation || 0;
  },
  _apply(cam) {
    // Port de DeviceOrientationControls (THREE) a pc.Quat: q = qy*qx*qz * q1 * q0.
    this._qz.setFromAxisAngle(this._axZ, -this._gamma);
    this._qx.setFromAxisAngle(this._axX, this._beta);
    this._qy.setFromAxisAngle(this._axY, this._alpha);
    this._q.copy(this._qy).mul(this._qx).mul(this._qz);
    this._q1.setFromAxisAngle(this._axX, -90); // mirar al horizonte (no al suelo)
    this._q0.setFromAxisAngle(this._axZ, -this._screenAngle());
    this._q.mul(this._q1).mul(this._q0);
    cam.setRotation(this._q);
  },
  _loop() {
    if (!this.active) return;
    const cam = this._findCam();
    if (cam) {
      if (cam !== this._cam) {
        this._cam = cam;
        this._disableControls(cam);
      }
      if (this._have) this._apply(cam);
    }
    this._raf = requestAnimationFrame(() => this._loop());
  },
  _updateBtn(on) {
    const btn = document.getElementById('gyro-btn');
    if (!btn) return;
    btn.classList.toggle('active', on);
    const label = btn.querySelector('.gyro-btn__label');
    if (label) label.textContent = on ? 'Salir AR' : 'Vista AR';
  }
};

function setupGyroButton() {
  const btn = document.getElementById('gyro-btn');
  if (!btn) return;
  // Solo en mobile y si el dispositivo expone sensores de orientación.
  if (!(pc.platform.mobile && gyroMode.available())) return;
  btn.hidden = false;
  btn.addEventListener('click', () => gyroMode.toggle());
}

// Oculta el chrome (menú lateral) cuando el mouse lleva un rato quieto, para una
// vista inmersiva; reaparece con cualquier movimiento del mouse/teclado.
function setupIdleHide() {
  const IDLE_MS = 2800;
  let timer = null;
  const wake = () => {
    document.body.classList.remove('is-idle');
    clearTimeout(timer);
    timer = setTimeout(() => document.body.classList.add('is-idle'), IDLE_MS);
  };
  ['mousemove', 'mousedown', 'wheel', 'keydown', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, wake, { passive: true })
  );
  wake();
}

function boot() {
  buildSceneMenu();
  setupTourButton();
  setupGyroButton();
  setupIdleHide();
  selectScene(SCENES[0]);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
