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
    tourDist: 18,
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
    tourMode: 'dolly',
    tourSpeed: 1.5,
    tourDist: 28,
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
    tourMode: 'dolly',
    tourSpeed: 1.8,
    tourDist: 20,
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
    { src: 'assets/voice/voice-06.mp3', at: 20000 }
  ]
};

// Volúmenes fijos: música al 30%, locución al 100%.
const MUSIC_VOL = 0.3;
const VOICE_VOL = 1.0;

// iOS ignora la propiedad `volume` de <audio> (siempre suena al 100%). Para que
// el 30% funcione también en iPhone, la música se enruta por Web Audio con un
// GainNode. Se conecta en el click de "Iniciar recorrido" (gesto de usuario,
// requisito de iOS). Si Web Audio falla, se cae al volumen normal del elemento.
let musicGainWired = false;
let musicCtx = null;
function wireMusicGain() {
  if (musicGainWired) {
    if (musicCtx && musicCtx.state === 'suspended') musicCtx.resume();
    return true;
  }
  const music = document.getElementById('tour-audio');
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!music || !Ctx) return false;
  try {
    musicCtx = new Ctx();
    const src = musicCtx.createMediaElementSource(music);
    const gain = musicCtx.createGain();
    gain.gain.value = MUSIC_VOL;
    src.connect(gain);
    gain.connect(musicCtx.destination);
    if (musicCtx.state === 'suspended') musicCtx.resume();
    musicGainWired = true;
    return true;
  } catch (e) {
    return false;
  }
}

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
  const keepId = ['application-canvas', 'loader', 'tour-btn', 'tour-audio', 'tour-voice', 'tour-caption'];
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
  const tourFwdH = new pc.Vec3();
  const tourTmp = new pc.Vec3();
  const tourLook = new pc.Vec3();

  currentAerial = {
    start() {
      tourActive = true;
      tourTime = 0;
      tourStartPos.copy(camera.getPosition());
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
    // mira hacia adelante, al nivel de la ciudad
    tourLook.copy(tourFwdH).mulScalar(radius * 0.5).add(tourTmp);
    tourLook.y = tourCenter.y;
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
        curve: scene.tourCurve
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
      const b = Math.min(time / 18, 1);
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
    const slot = SCENE_DWELL_MS / msgs.length;
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
  start() {
    if (this.active) return;
    this.active = true;
    const audio = document.getElementById('tour-audio');
    if (audio) {
      // Con GainNode activo el elemento va al 100% y el nodo aplica el 30%
      // (si no, doble atenuación en desktop). Sin Web Audio, volumen clásico.
      audio.volume = wireMusicGain() ? 1 : MUSIC_VOL;
      audio.play().catch(() => {});
    }
    this._updateBtn(true);
    this._runCurrent();
  },
  stop() {
    this.active = false;
    clearTimeout(this._timer);
    captions.clear();
    voiceover.clear();
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
    // Mensajes en tarjetas y locución para esta escena.
    captions.showFor(currentSceneId);
    voiceover.showFor(currentSceneId);
    // Precarga la siguiente escena durante este turno (30 s de margen).
    const idx = SCENES.findIndex((s) => s.id === currentSceneId);
    preloadScene(SCENES[(idx + 1) % SCENES.length]);
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
