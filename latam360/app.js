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
    // Avanza RECTO; gira la vista a la izquierda hasta terminar mirando ATRÁS (-180°).
    tourMode: 'dolly',
    tourSpeed: 0.7,
    tourDist: 18,
    tourYawDeg: -180,
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
    // Cruza el portal RECTO mirando al frente; SOLO DESPUÉS (yawDelay) el camino
    // CURVA ~80° para esquivar el árbol del fondo y la VISTA gira de vuelta al
    // portal (lookBack). Así no choca y se ve el portal desde el otro lado.
    tourMode: 'dolly',
    tourSpeed: 1.6,
    tourDist: 18,
    tourYawDeg: 80,
    tourCurve: true,
    tourLookBack: true,
    tourYawDelay: 9,
    tourYawDur: 7,
    preload: [
      'https://code.playcanvas.com/examples_data/example_roman_parish_02/lod-meta.json',
      'https://code.playcanvas.com/examples_data/example_skatepark_02/lod-meta.json'
    ]
  },
  {
    id: 'cf100',
    type: 'module',
    module: 'cf100.mjs',
    name: 'Cápsula producto',
    place: 'CF-100 · memorial aéreo',
    tag: 'Hotspots · testimonio',
    desc: 'La cápsula como producto: puntos de interés anclados al avión y el testimonio de su gente en video embebido.',
    credit: 'Escaneo: Brandon Barker (superspl.at) · CC BY',
    tourMode: 'swing',
    preload: ['/latam360/assets/splats/cf100-lite.sog']
  },
  {
    // Escena de PRUEBA (oculta del menú): primer splat entrenado por Doppel en el
    // pipeline propio (video aéreo → COLMAP → Brush/Metal). Solo vía ?scene=prueba.
    id: 'prueba',
    hidden: true,
    type: 'module',
    module: 'prueba.mjs',
    name: 'Prueba Doppel',
    place: 'Splat propio · pipeline Doppel',
    tag: 'Test interno',
    desc: 'Primer splat entrenado con el pipeline propio de Doppel: video aéreo → poses COLMAP → entrenamiento 3DGS local.',
    credit: 'Captura: material de archivo · Entrenamiento: Doppel',
    tourMode: 'swing',
    preload: ['/latam360/assets/splats/prueba-lite.sog']
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
  'splat-portal': ['Un portal entre dos mundos', 'Realidades capturadas, conectadas'],
  cf100: ['La cápsula, como producto', 'Toca a la persona: su testimonio en video']
};

// Locución del recorrido: clips por escena, con su instante de inicio (ms) dentro
// del turno de 30 s. El cierre (06) suena en el turno del portal, tras su clip.
// OJO: rutas ABSOLUTAS — el demo vive en /latam360/demo/, así que una ruta relativa
// "assets/…" apuntaría dentro de /demo/ y la locución quedaría muda (404).
const TOUR_VOICES = {
  downtown: [{ src: '/latam360/assets/voice/voice-01.mp3', at: 1500 }],
  'lod-streaming': [{ src: '/latam360/assets/voice/voice-02.mp3', at: 1500 }],
  'first-person': [{ src: '/latam360/assets/voice/voice-03.mp3', at: 1500 }],
  reveal: [{ src: '/latam360/assets/voice/voice-04.mp3', at: 1500 }],
  'splat-portal': [
    { src: '/latam360/assets/voice/voice-05.mp3', at: 1500 },
    { src: '/latam360/assets/voice/voice-06.mp3', at: 10000 }
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
  // `onReady` se dispara cuando la música EMPIEZA a sonar de verdad (evento 'playing'),
  // para arrancar la locución/cámara recién ahí y que vayan sincronizadas (la música
  // tarda en bufferear los 3MB; antes la locución se adelantaba). Fallback a 3.5s.
  start(onReady) {
    this.active = true;
    const el = this.el();
    let fired = false;
    const ready = () => {
      if (fired) return;
      fired = true;
      if (onReady) onReady();
    };
    if (!el) {
      ready();
      return;
    }
    el.loop = true;
    el.preload = 'auto';
    el.volume = MUSIC_VOL; // 1.0 — iOS lo ignora, pero el nivel ya va en el archivo
    el.addEventListener('playing', ready, { once: true });
    setTimeout(ready, 3500); // por si 'playing' no dispara
    if (!el.paused && el.readyState >= 3) ready(); // ya estaba sonando (escenas siguientes)
    el.play().catch(() => {});
  },
  // Precarga el archivo (en el primer gesto) para que al iniciar el recorrido ya
  // esté bufferado y 'playing' dispare de inmediato (sin desfase con la locución).
  preload() {
    const el = this.el();
    if (!el) return;
    el.preload = 'auto';
    try {
      el.load();
    } catch (e) {
      /* noop */
    }
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

// Sonido ambiental POR ESCENA (texturas sintetizadas a medida, ~-47 dB = bajo la
// música). Suena siempre, mezclado bajo la música y la locución. iOS ignora
// `volume`, así que el nivel real va horneado en el archivo. Arranca en el primer
// gesto del usuario (igual que la música).
const AMBIENT_V = '4'; // subir cuando se re-rendericen las pistas (evita caché vieja)
const AMBIENT = {
  downtown: 'assets/ambient/city.mp3',
  'lod-streaming': 'assets/ambient/courtyard.mp3',
  'first-person': 'assets/ambient/park.mp3',
  reveal: 'assets/ambient/interior.mp3',
  'splat-portal': 'assets/ambient/portal.mp3',
  cf100: 'assets/ambient/park.mp3',
  prueba: 'assets/ambient/city.mp3'
};
const ambientPlayer = {
  _el: null,
  _unlocked: false,
  _muted: false, // apagado manual por el usuario (botón)
  _videoPaused: false, // pausa temporal mientras se reproduce un video de call-out
  _hasSrc: false,
  el() {
    if (!this._el) this._el = document.getElementById('ambient-audio');
    return this._el;
  },
  setScene(sceneId) {
    const el = this.el();
    if (!el) return;
    const src = AMBIENT[sceneId];
    if (!src) {
      this._hasSrc = false;
      this._apply();
      return;
    }
    const abs = `/latam360/${src}?v=${AMBIENT_V}`;
    if (el.getAttribute('src') !== abs) el.src = abs;
    el.loop = true;
    el.volume = 1.0; // el nivel va horneado en el archivo
    this._hasSrc = true;
    this._apply();
  },
  // Reproduce o pausa según el estado (desbloqueado, con pista, no muteado, sin video).
  _apply() {
    const el = this.el();
    if (!el) return;
    if (this._unlocked && this._hasSrc && !this._muted && !this._videoPaused) {
      el.play().catch(() => {});
    } else {
      try {
        el.pause();
      } catch (e) {
        /* noop */
      }
    }
  },
  // Llamar en el primer gesto del usuario (iOS exige gesto para reproducir audio).
  unlock() {
    this._unlocked = true;
    this._apply();
  },
  setMuted(m) {
    this._muted = m;
    this._apply();
  },
  toggleMuted() {
    this.setMuted(!this._muted);
    return this._muted;
  },
  // Pausa/reanuda el ambiente mientras hay un video de call-out reproduciéndose.
  pauseForVideo(on) {
    this._videoPaused = on;
    this._apply();
  }
};

// ---------------------------------------------------------------------------
// Call-outs (hotspots): puntos clicables anclados en el splat que despliegan una
// tarjeta con info, fotos y video embebido. El marcador se proyecta de 3D a pantalla
// cada frame y sigue la cámara. Se editan por escena en HOTSPOTS (pos = [x,y,z]).
// MODO EDICIÓN: abre la escena con ?hs=1 y haz clic para obtener coordenadas.
// Campos por call-out: pos [x,y,z] (o auto:N = N unidades frente a la cámara al
// cargar), label, title, subtitle, body (HTML), image (url), video (url de embed).
// ---------------------------------------------------------------------------
// Modo de la página: '' = demo completo; 'product' = embebido de producto (una sola
// cápsula, visita guiada con barra de progreso, sin menú de escenas). Lo define la
// página huésped (producto/index.html) antes de cargar este módulo.
const L360_MODE = (typeof window !== 'undefined' && window.__L360_MODE) || '';

// NOTA sobre el anclaje de puntos en cf100: este splat NO es solo el avión — es toda
// la plaza del memorial (~1.5M splats: pasto, postes, árboles) con el CF-100 montado en
// un pedestal. Por eso NO se puede anclar por fracciones del aabb del splat (`aabbOff`):
// cualquier caja (instance/resource) abarca la plaza entera y hasta trae outliers, dando
// posiciones enormes y dependientes de la vista. Los 3 puntos usan COORDENADAS FIJAS de
// MUNDO (`pos`), medidas sobre el avión real en producción y verificadas visualmente
// (avión centrado ~[-8.5, 3.4, -18.2]; eje Z = envergadura, Y = vertical).
const HOTSPOTS = {
  cf100: [
    {
      pos: [-8.5, 5.5, -17], // fuselaje / cabina
      testi: true, // en la página producto, este punto abre la tarjeta de testimonio
      avatar: 'C',
      avatarImg:
        'https://i.vimeocdn.com/video/2175402848-210ddd5959f3939960eb1bdc45e1df106d684068e0140d52876233438fe2567a-d_640?region=us',
      label: '▶ Camila · su testimonio',
      title: 'Camila · Técnica de Mantenimiento',
      subtitle: 'Centro de Mantenimiento · Santiago',
      body:
        '<p>“Acá revisamos cada componente antes de que vuelva a volar. ' +
        'Te muestro cómo trabajamos.”</p>' +
        '<p style="opacity:.6;font-size:12px">Hotspot de producto: la gente de la ' +
        'filial, en video, dentro de su espacio real.</p>',
      video: 'https://player.vimeo.com/video/1206534909?h=e572ee7fb2'
    },
    {
      pos: [-8.5, 8, -15.5], // cola / aleta vertical
      label: 'Estructura de cola',
      title: 'Estructura de cola',
      subtitle: 'Cápsula · mantenimiento',
      body: '<p>Cada punto de interés despliega información de la operación: qué se revisa aquí y quién lo hace.</p>'
    },
    {
      pos: [-8.5, 1.5, -15], // tren / panza
      label: 'Tren de aterrizaje',
      title: 'Tren de aterrizaje',
      subtitle: 'Cápsula · mantenimiento',
      body: '<p>Los datos viven anclados al espacio real: al moverte, cada punto queda donde corresponde.</p>'
    }
  ],
  downtown: [
    {
      auto: 26, // sin pos fija: se ancla 26u frente a la cámara al cargar (visible de entrada)
      label: 'Ver más',
      title: 'Punto de interés',
      subtitle: 'Call-out de ejemplo',
      video: 'https://player.vimeo.com/video/1206534909?h=e572ee7fb2', // video de ejemplo (Vimeo unlisted)
      body:
        '<p>Así se despliega un call-out: al tocar un punto anclado en el splat, ' +
        'aparece esta tarjeta con <b>video embebido</b>, texto e imagen.</p>' +
        '<p style="opacity:.6;font-size:12px">Contenido editable por punto ' +
        '(testimonio en video, foto del lugar, datos de la operación).</p>',
      image: '/latam360/assets/callouts/sample.jpg'
    }
  ]
};

const callouts = {
  _raf: 0,
  _markers: [],
  _scr: null,
  init() {
    this._scr = new pc.Vec3();
    const closeBtn = document.getElementById('callout-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeCard());
    const card = document.getElementById('callout');
    if (card) card.addEventListener('click', (e) => { if (e.target === card) this.closeCard(); });
    if (new URLSearchParams(location.search).has('hs')) this._setupEditor();
    this._loop();
  },
  setScene(sceneId) {
    this.closeCard();
    this._markers.forEach((m) => m.el.remove());
    this._markers = [];
    this._readyAt = 0; // se re-detecta cuándo el splat de la escena nueva es visible
    this._camSeenAt = 0; // fallback: cuánto llevamos con cámara sin aabb detectado
    this._box = null; // caja del splat de la escena nueva (para anclajes aabbOff)
    const layer = document.getElementById('callout-markers');
    if (!layer) return;
    (HOTSPOTS[sceneId] || []).forEach((hs) => {
      const el = document.createElement('button');
      el.className = 'hotspot';
      // `avatar`: marcador estilo persona (círculo con foto o iniciales) — producto.
      const avStyle = hs.avatarImg
        ? ` style="background-image:url('${hs.avatarImg}');background-size:cover;background-position:center"`
        : '';
      el.innerHTML = hs.avatar
        ? `<span class="hotspot__dot hotspot__dot--avatar"${avStyle}>${hs.avatarImg ? '' : hs.avatar}</span><span class="hotspot__label">${hs.label || ''}</span>`
        : `<span class="hotspot__dot"></span><span class="hotspot__label">${hs.label || ''}</span>`;
      if (hs.testi) el.dataset.testi = '1'; // la página producto intercepta SOLO este
      el.style.display = 'none';
      layer.appendChild(el);
      const m = {
        el,
        hs,
        pos: hs.pos ? new pc.Vec3(hs.pos[0], hs.pos[1], hs.pos[2]) : new pc.Vec3(),
        placed: !!hs.pos,
        cssX: 0,
        cssY: 0
      };
      el.addEventListener('click', () => this.openCard(hs, m));
      this._markers.push(m);
    });
  },
  _findCam() {
    if (!currentApp) return null;
    let c = null;
    currentApp.root.forEach((e) => {
      if (e.camera) c = e;
    });
    return c;
  },
  _loop() {
    const cam = this._findCam();
    if (cam && cam.camera && this._markers.length) {
      const hidden = document.body.classList.contains('touring'); // ocultar en el recorrido
      // Los puntos aparecen cuando la escena YA se reveló (loader oculto). Señal simple y
      // fiable — NO dependemos del aabb del splat: el getter `gsplat.instance` puede
      // devolver null aunque el splat renderice (vive en `_instance`), y además su aabb
      // va ligado a la cámara. Los `pos` son coordenadas FIJAS de mundo; los `auto`
      // (relativos a la cámara) se colocan al revelarse, con la cámara ya encuadrada.
      const loaderEl = document.getElementById('loader');
      const ready = !loaderEl || loaderEl.classList.contains('hidden');
      const autoOk = ready;
      for (const m of this._markers) {
        if (!m.placed && m.hs.auto && autoOk) {
          // Ancla el punto N unidades frente a la cámara inicial, con desvíos
          // laterales/verticales opcionales (autoRight/autoUp) para repartir puntos.
          const f = cam.forward;
          const r = cam.right;
          const u = cam.up;
          const p = cam.getPosition();
          const ar = m.hs.autoRight || 0;
          const au = m.hs.autoUp || 0;
          m.pos.set(
            p.x + f.x * m.hs.auto + r.x * ar + u.x * au,
            p.y + f.y * m.hs.auto + r.y * ar + u.y * au,
            p.z + f.z * m.hs.auto + r.z * ar + u.z * au
          );
          m.placed = true;
        }
        if (!m.placed || hidden || !ready) {
          m.el.style.display = 'none';
          continue;
        }
        // OJO: worldToScreen entrega píxeles CSS (usa device.clientRect) — usar tal
        // cual, SIN re-escalar por el buffer del canvas (eso corría el marcador y
        // lo hacía "derivar" al mover la cámara, peor aún con resolución adaptativa).
        cam.camera.worldToScreen(m.pos, this._scr);
        if (this._scr.z <= 0) {
          m.el.style.display = 'none'; // detrás de la cámara
          continue;
        }
        m.cssX = this._scr.x;
        m.cssY = this._scr.y;
        m.el.style.display = '';
        m.el.style.transform = `translate(-50%, -50%) translate(${m.cssX}px, ${m.cssY}px)`;
      }
    } else {
      this._markers.forEach((m) => (m.el.style.display = 'none'));
    }
    this._raf = requestAnimationFrame(() => this._loop());
  },
  openCard(hs, m) {
    // En la página producto, el punto de la persona abre/reproduce la tarjeta de
    // testimonio propia de esa página (definida por el huésped), no el callout genérico.
    if (hs.testi && typeof window !== 'undefined' && typeof window.__l360PlayTesti === 'function') {
      window.__l360PlayTesti();
      return;
    }
    const card = document.getElementById('callout');
    const media = document.getElementById('callout-media');
    const body = document.getElementById('callout-body');
    if (!card || !media || !body) return;
    let mediaHtml = '';
    if (hs.video) {
      mediaHtml +=
        `<div class="callout__video"><iframe src="${hs.video}" title="video" frameborder="0" ` +
        `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
        `allowfullscreen></iframe></div>`;
    }
    if (hs.image) mediaHtml += `<img class="callout__img" src="${hs.image}" alt="" />`;
    media.innerHTML = mediaHtml;
    body.innerHTML =
      `${hs.title ? `<h3 class="callout__title">${hs.title}</h3>` : ''}` +
      `${hs.subtitle ? `<div class="callout__sub">${hs.subtitle}</div>` : ''}` +
      `${hs.body || ''}`;
    card.hidden = false;
    this._positionCard(m);
    if (hs.video) ambientPlayer.pauseForVideo(true); // apaga el ambiente durante el video
  },
  // Ancla la tarjeta junto al punto (desktop); en móvil queda como hoja inferior (CSS).
  _positionCard(m) {
    const card = document.getElementById('callout');
    if (!card) return;
    if (window.innerWidth <= 820 || !m) {
      card.style.left = card.style.top = card.style.right = card.style.bottom = '';
      return;
    }
    card.style.right = 'auto';
    card.style.bottom = 'auto';
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const pad = 16;
    let left = m.cssX + 22; // a la derecha del punto
    if (left + w > window.innerWidth - pad) left = m.cssX - 22 - w; // si no cabe, a la izquierda
    if (left < pad) left = pad;
    const place = (hh) => {
      let top = m ? m.cssY - hh / 2 : pad; // centrada verticalmente al punto
      if (top + hh > window.innerHeight - pad) top = window.innerHeight - pad - hh; // sube si no cabe
      if (top < pad) top = pad;
      card.style.top = `${top}px`;
      // Nunca desbordar por abajo (scroll interno solo si es más alta que la ventana).
      card.style.maxHeight = `${window.innerHeight - top - pad}px`;
    };
    card.style.left = `${left}px`;
    place(h);
    // Segundo pase: al frame siguiente el contenido (video/fuentes) ya midió su
    // altura real — re-sube la tarjeta para que se vea COMPLETA sin scroll.
    requestAnimationFrame(() => {
      if (!card.hidden) place(card.offsetHeight);
    });
  },
  closeCard() {
    const card = document.getElementById('callout');
    const media = document.getElementById('callout-media');
    if (media) media.innerHTML = ''; // detiene el video al cerrar
    if (card) card.hidden = true;
    ambientPlayer.pauseForVideo(false); // reanuda el ambiente
  },
  _setupEditor() {
    const panel = document.getElementById('callout-editor');
    if (!panel) return;
    panel.hidden = false;
    panel.textContent = 'Edición call-outs: haz clic en la escena para leer coordenadas.';
    const world = new pc.Vec3();
    // Escuchamos en window (el canvas se recrea por escena) y filtramos por target.
    window.addEventListener('click', (e) => {
      const canvas = document.getElementById('application-canvas');
      if (!canvas || e.target !== canvas) return; // solo clics sobre la escena
      const cam = this._findCam();
      if (!cam || !cam.camera) {
        panel.textContent = 'Cargando escena…';
        return;
      }
      // screenToWorld espera píxeles CSS (clientRect), no del buffer del canvas.
      const rect = canvas.getBoundingClientRect();
      cam.camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top, 30, world);
      panel.innerHTML = `pos: <b>[${world.x.toFixed(2)}, ${world.y.toFixed(2)}, ${world.z.toFixed(2)}]</b> — 30u frente a la cámara`;
    });
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
  loaderProgress.finish();
  loaderEl().classList.add('hidden');
  // Cuando la nueva escena ya pintó su primer frame, desvanece el overlay de
  // transición para revelarla con un fade limpio (en vez de un corte seco).
  sceneTransition.reveal();
}

// Barra/porcentaje de avance en la pantalla de carga. La carga de splats no expone
// un % de bytes fiable (LOD se transmite por chunks), así que mostramos un avance
// suavizado que acelera al principio y se completa (100%) cuando la escena pinta.
const loaderProgress = {
  _raf: 0,
  _start: 0,
  _pct: 0,
  _running: false,
  start() {
    this._running = true;
    this._pct = 0;
    this._start = performance.now();
    this._render(0);
    cancelAnimationFrame(this._raf);
    this._tick();
  },
  _tick() {
    if (!this._running) return;
    const t = (performance.now() - this._start) / 1000;
    const target = 96 * (1 - Math.exp(-t / 3.5)); // sube rápido y desacelera hacia 96%
    if (target > this._pct) this._pct = target;
    this._render(this._pct);
    this._raf = requestAnimationFrame(() => this._tick());
  },
  finish() {
    if (!this._running) return;
    this._running = false;
    cancelAnimationFrame(this._raf);
    this._render(100);
  },
  halt() {
    this._running = false;
    cancelAnimationFrame(this._raf);
  },
  _render(pct) {
    const t = document.getElementById('loader-pct');
    if (t) t.textContent = `${Math.round(pct)}%`;
    const bar = document.getElementById('loader-bar');
    if (bar) bar.style.width = `${pct}%`;
  }
};

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
  loaderProgress.halt();
  loaderTextEl().innerHTML = msg;
  loaderEl().classList.remove('hidden');
  loaderEl().classList.add('is-error');
}

// última build (la caché de Cloudflare puede servir código viejo). Súbelo en cada cambio.

// Detección de dispositivo táctil. Más fiable que `pc.platform.mobile` (que puede
// dar false en iOS según el user-agent) para mostrar el hint de dedo y el botón AR.
const IS_TOUCH =
  (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
  (typeof window !== 'undefined' && 'ontouchstart' in window) ||
  !!(pc.platform && pc.platform.mobile);

// Resolución adaptativa: el costo del splatting escala con los píxeles renderizados.
// Si el framerate cae, baja gradualmente la resolución interna (los splats son
// suaves: apenas se nota); cuando sobra rendimiento, la recupera hasta su techo.
// Mantiene pantalla completa y fluidez a la vez.
function setupAdaptiveResolution(app) {
  const gd = app.graphicsDevice;
  if (!gd) return;
  const MIN = pc.platform.mobile ? 0.55 : 0.7;
  let max = gd.maxPixelRatio || (pc.platform.mobile ? 1 : 1.25); // techo = valor inicial
  let ema = 1 / 60; // media móvil del frame time
  let cooldown = 1.5; // deja estabilizar la carga inicial
  app.on('update', (dt) => {
    if (!dt || dt > 0.5) return; // ignora hipos (cambio de pestaña, carga)
    ema += (dt - ema) * 0.06;
    cooldown -= dt;
    if (cooldown > 0) return;
    const fps = 1 / ema;
    const r = gd.maxPixelRatio;
    max = Math.max(max, r); // si la escena subió su techo después, respétalo
    if (fps < 45 && r > MIN) {
      gd.maxPixelRatio = Math.max(MIN, r - 0.15);
      app.resizeCanvas();
      cooldown = 1.5;
    } else if (fps > 56 && r < max) {
      gd.maxPixelRatio = Math.min(max, r + 0.1);
      app.resizeCanvas();
      cooldown = 2.5; // sube con más calma que baja (evita oscilar)
    }
  });
}

function setActiveScene(scene) {
  document.querySelectorAll('.scene-card').forEach((el) => {
    el.classList.toggle('active', el.dataset.scene === scene.id);
  });
  $('#info-name').textContent = scene.name;
  $('#info-place').textContent = scene.place;
  $('#info-desc').textContent = scene.desc;
  $('#info-credit').textContent = scene.credit;
  const touch = IS_TOUCH;
  let hint;
  if (scene.id === 'first-person' || scene.id === 'cf100' || scene.id === 'prueba') {
    // navegación de doble gesto (dedo izq avanza/retrocede, der controla la dirección)
    hint = touch
      ? 'Dedo izquierdo para avanzar · derecho para la dirección'
      : 'Arrastra para mirar · WASD para moverte';
  } else if (scene.type === 'lod') {
    hint = touch ? 'Desliza para explorar la ciudad' : 'Arrastra para mirar · WASD para moverte';
  } else {
    hint = touch ? 'Desliza para orbitar · pellizca para acercar' : 'Arrastra para orbitar · rueda para acercar';
  }
  showHint(hint);
}

// Muestra el hint de controles y lo auto-oculta a los pocos segundos, para no tapar
// la vista de forma permanente. Reaparece al cambiar de escena (o entrar a AR).
let _hintTimer = null;
function showHint(text) {
  const el = $('#hint');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('hint--hidden');
  clearTimeout(_hintTimer);
  _hintTimer = setTimeout(() => el.classList.add('hint--hidden'), 5000);
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
  // El canvas recreado debe entrar a la "fotografía" del DOM inicial: si no,
  // cleanInjectedDom lo borra en el siguiente cambio de escena y la navegación
  // entre splats se rompe (la 2ª escena ya no encuentra canvas).
  _initialDom.add(c);
  return c;
}

// Elimina el DOM que inyectan los ejemplos (paneles, stats, etc.) al salir de la
// escena. En vez de una lista blanca (frágil: cada elemento nuevo de una página se
// borraba por accidente), se FOTOGRAFÍA el DOM inicial de la página al arrancar y
// solo se elimina lo agregado después (lo inyectado por los módulos de ejemplo).
const _initialDom = new WeakSet();
function snapshotInitialDom() {
  Array.from(document.body.children).forEach((el) => _initialDom.add(el));
}
function cleanInjectedDom() {
  Array.from(document.body.children).forEach((el) => {
    if (el.tagName === 'SCRIPT') return;
    if (_initialDom.has(el)) return;
    if (el.id === 'scene-transition') return; // overlay propio creado en runtime
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
  setupAdaptiveResolution(app);

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

  // Presupuesto de splats algo más bajo = más fluido (la pérdida visual es mínima).
  const budget = pc.platform.mobile ? 3 : 6;
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
      window.__l360App = app; // acceso de depuración (leer aabb, cámara, etc.)
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
      setupAdaptiveResolution(app);
      // Movimiento de cámara para el recorrido (dolly o swing).
      setupModuleAerial(app, scene.tourMode || 'dolly', {
        speed: scene.tourSpeed,
        dist: scene.tourDist,
        arc: scene.tourReach,
        yawDeg: scene.tourYawDeg,
        curve: scene.tourCurve,
        yawDelay: scene.tourYawDelay,
        yawDur: scene.tourYawDur,
        lookBack: scene.tourLookBack
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
  const backDir = new pc.Vec3();

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
      if (opts.lookBack) {
        // Mira de vuelta al punto inicial (el portal): mezcla gradual (b) entre la
        // mirada de avance y la dirección hacia startPos. El CAMINO curva aparte.
        backDir.copy(startPos).sub(tmp);
        backDir.y = 0;
        if (backDir.length() < 1e-3) backDir.copy(fwdH).mulScalar(-1);
        backDir.normalize();
        look.copy(opts.curve ? curDir : fwdH);
        look.lerp(look, backDir, b).normalize();
        look.y = startFwdFull.y;
        look.normalize().mulScalar(20).add(tmp);
      } else if (opts.curve && opts.yawDeg) {
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
async function selectScene(scene, opts = {}) {
  currentSceneId = scene.id;
  setActiveScene(scene);
  ambientPlayer.setScene(scene.id); // ambiente de la escena (suena bajo la música)
  callouts.setScene(scene.id); // call-outs (hotspots) de la escena
  loaderEl().classList.remove('is-error');
  // Auto-avance del recorrido (escenas precargadas, rápidas): transición con fade.
  // Primera carga y selección manual: pantalla de carga con % de avance.
  if (opts.fade && sceneShownOnce) {
    await sceneTransition.cover();
  } else {
    showLoader(scene.type === 'lod' ? 'Transmitiendo la ciudad…' : 'Cargando experiencia…');
    loaderProgress.start();
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
  SCENES.filter((s) => !s.hidden).forEach((scene) => {
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
    callouts.closeCard(); // cierra cualquier call-out abierto
    this.active = true;
    document.body.classList.add('touring'); // oculta el hint de controles durante el recorrido
    // Arranca la música y, SOLO cuando empieza a sonar, lanza locución/cámara para
    // que vayan juntas (antes la locución se adelantaba mientras la música cargaba).
    musicPlayer.start(() => {
      if (this.active) this._runCurrent();
    });
    // Keepalive: en iOS el AudioContext se suspende al cambiar de escena; lo
    // reanudamos periódicamente para que la música no se corte entre splats.
    clearInterval(this._keepalive);
    this._keepalive = setInterval(() => musicPlayer.ensure(), 1500);
    this._updateBtn(true);
  },
  stop() {
    this.active = false;
    document.body.classList.remove('touring');
    clearTimeout(this._timer);
    clearInterval(this._keepalive);
    this._stopProgress();
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
    this._startProgress(); // barra "visita virtual" (solo existe en modo producto)
    // Precarga la siguiente escena VISIBLE durante este turno.
    const vis = SCENES.filter((s) => !s.hidden);
    const idx = vis.findIndex((s) => s.id === currentSceneId);
    preloadScene(vis[(idx + 1) % vis.length]);
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._advance(), dwellFor(currentSceneId));
  },
  async _advance() {
    if (!this.active) return;
    // Modo producto: la visita es de UNA cápsula — termina aquí, sin avanzar.
    if (L360_MODE === 'product') {
      this.stop();
      return;
    }
    // El recorrido solo pasa por las escenas VISIBLES (las ocultas son de prueba).
    const visibles = SCENES.filter((s) => !s.hidden);
    const idx = visibles.findIndex((s) => s.id === currentSceneId);
    // Tras el último splat: terminar el recorrido (para música/locución/cámara,
    // muestra de nuevo el menú) y volver al primero en modo libre.
    if (idx === -1 || idx === visibles.length - 1) {
      this.stop();
      await selectScene(visibles[0]);
      return;
    }
    const next = visibles[idx + 1];
    await selectScene(next, { fade: true });
    if (!this.active) return;
    this._runCurrent();
  },
  // Barra de progreso de la visita (elementos #visit* — solo en la página producto).
  _progressTick: null,
  _startProgress() {
    const box = document.getElementById('visit');
    const fill = document.getElementById('visit-fill');
    const pin = document.getElementById('visit-pin');
    const label = document.getElementById('visit-label');
    if (!box || !fill) return;
    const scene = SCENES.find((s) => s.id === currentSceneId);
    // La página producto puede fijar el rótulo (ej. "Visita virtual del Centro de
    // Mantenimiento"); se le suma "Punto X de 10" según el avance, como el mockup.
    const base =
      (typeof window !== 'undefined' && window.__L360_VISIT_LABEL) ||
      `Visita virtual · ${(scene && scene.place) || ''}`;
    box.hidden = false;
    fill.style.width = '0%';
    const total = dwellFor(currentSceneId);
    const t0 = performance.now();
    clearInterval(this._progressTick);
    this._progressTick = setInterval(() => {
      const p = Math.min(100, ((performance.now() - t0) / total) * 100);
      fill.style.width = `${p}%`;
      if (pin) pin.style.left = `${p}%`;
      if (label) label.textContent = `${base} · Punto ${Math.max(1, Math.ceil(p / 10))} de 10`;
    }, 250);
  },
  _stopProgress() {
    clearInterval(this._progressTick);
    const box = document.getElementById('visit');
    if (box) box.hidden = true;
  },
  _updateBtn(active) {
    const btn = document.getElementById('tour-btn');
    if (!btn) return;
    btn.classList.toggle('active', active);
    const label = btn.querySelector('.tour-btn__label');
    const icon = btn.querySelector('.tour-btn__icon');
    const product = L360_MODE === 'product';
    if (label) {
      label.textContent = active
        ? (product ? 'Detener visita' : 'Detener recorrido')
        : (product ? 'Visita guiada' : 'Iniciar recorrido');
    }
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
  // Controles táctiles añadidos al giroscopio: dedo izq = mover, dedo der = girar vista.
  _yawOffset: 0, // grados, ajustable con el dedo (gira la vista sin mover el teléfono)
  _moveX: 0,
  _moveZ: 0, // -1..1 (strafe, adelante)
  _leftId: null,
  _rightId: null,
  _leftSX: 0,
  _leftSY: 0,
  _rightLX: 0,
  _lastT: 0,
  _scale: 5,
  _onTS: null,
  _onTM: null,
  _onTE: null,
  available() {
    return typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';
  },
  async toggle() {
    if (this.active) this.disable();
    else await this.enable();
  },
  async enable() {
    if (!this.available()) {
      $('#hint').textContent = 'Tu navegador no permite la vista AR (revisa Ajustes → Safari → Movimiento)';
      return;
    }
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
      this._qOff = new pc.Quat();
      this._qFinal = new pc.Quat();
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
    // Controles táctiles (joystick izq = mover, drag der = girar la vista).
    this._yawOffset = 0;
    this._moveX = 0;
    this._moveZ = 0;
    this._leftId = null;
    this._rightId = null;
    this._lastT = performance.now();
    this._scale = this._sceneScale();
    this._onTS = (e) => this._touchStart(e);
    this._onTM = (e) => this._touchMove(e);
    this._onTE = (e) => this._touchEnd(e);
    window.addEventListener('touchstart', this._onTS, { passive: true });
    window.addEventListener('touchmove', this._onTM, { passive: true });
    window.addEventListener('touchend', this._onTE);
    window.addEventListener('touchcancel', this._onTE);
    this.active = true;
    document.body.classList.add('gyro-on');
    showHint('AR: mueve el teléfono · desliza izq. para avanzar · der. para girar la vista');
    this._updateBtn(true);
    this._loop();
  },
  disable() {
    this.active = false;
    if (this._onOrient) window.removeEventListener('deviceorientation', this._onOrient, true);
    this._onOrient = null;
    if (this._onTS) {
      window.removeEventListener('touchstart', this._onTS, { passive: true });
      window.removeEventListener('touchmove', this._onTM, { passive: true });
      window.removeEventListener('touchend', this._onTE);
      window.removeEventListener('touchcancel', this._onTE);
    }
    this._onTS = this._onTM = this._onTE = null;
    this._moveX = this._moveZ = 0;
    this._leftId = this._rightId = null;
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
    // Convención screen.orientation: 0/90/180/270. OJO: `window.orientation` (API vieja)
    // usa el signo OPUESTO en landscape (angle 90 ↔ window.orientation -90), así que el
    // fallback se convierte a esta convención para que el compensador tenga un signo único.
    const so = screen.orientation && screen.orientation.angle;
    if (so != null) return so;
    const wo = window.orientation;
    return wo != null ? (360 - wo) % 360 : 0;
  },
  _apply(cam) {
    // Port de DeviceOrientationControls (THREE) a pc.Quat: q = qy*qx*qz * q1 * q0.
    this._qz.setFromAxisAngle(this._axZ, -this._gamma);
    this._qx.setFromAxisAngle(this._axX, this._beta);
    this._qy.setFromAxisAngle(this._axY, this._alpha);
    this._q.copy(this._qy).mul(this._qx).mul(this._qz);
    this._q1.setFromAxisAngle(this._axX, -90); // mirar al horizonte (no al suelo)
    // Compensación por rotación de pantalla. SIGNO POSITIVO con screen.orientation.angle:
    // el port de THREE usaba `-window.orientation`, y como angle = -window.orientation en
    // landscape, +angle equivale a -window.orientation. Antes iba `-screenAngle()` → en
    // landscape (iPad) la imagen salía girada 90° ("vertical"). En portrait (angle 0) no cambia.
    this._q0.setFromAxisAngle(this._axZ, this._screenAngle());
    this._q.mul(this._q1).mul(this._q0);
    // Giro táctil: rota TODA la vista alrededor del eje vertical del mundo (premultiplica).
    this._qOff.setFromAxisAngle(this._axY, this._yawOffset);
    this._qFinal.mul2(this._qOff, this._q);
    cam.setRotation(this._qFinal);
  },
  _sceneScale() {
    if (!currentApp) return 5;
    const box = new pc.BoundingBox();
    let has = false;
    currentApp.root.forEach((e) => {
      const b = e.gsplat && e.gsplat.instance && e.gsplat.instance.aabb;
      if (b && b.halfExtents.length() > 0) {
        if (!has) {
          box.copy(b);
          has = true;
        } else {
          box.add(b);
        }
      }
    });
    return has ? Math.max(2, box.halfExtents.length() * 0.5) : 5;
  },
  _touchStart(e) {
    if (!this.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.target && t.target.id !== 'application-canvas') continue; // ignora toques en botones/menú
      const leftHalf = t.clientX < window.innerWidth / 2;
      if (leftHalf && this._leftId === null) {
        this._leftId = t.identifier;
        this._leftSX = t.clientX;
        this._leftSY = t.clientY;
      } else if (!leftHalf && this._rightId === null) {
        this._rightId = t.identifier;
        this._rightLX = t.clientX;
      }
    }
  },
  _touchMove(e) {
    if (!this.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === this._leftId) {
        const R = 60; // radio del joystick (px)
        this._moveX = Math.max(-1, Math.min(1, (t.clientX - this._leftSX) / R));
        this._moveZ = Math.max(-1, Math.min(1, -(t.clientY - this._leftSY) / R)); // arrastrar arriba = adelante
      } else if (t.identifier === this._rightId) {
        this._yawOffset -= (t.clientX - this._rightLX) * 0.3; // grados/px
        this._rightLX = t.clientX;
      }
    }
  },
  _touchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === this._leftId) {
        this._leftId = null;
        this._moveX = 0;
        this._moveZ = 0;
      }
      if (t.identifier === this._rightId) this._rightId = null;
    }
  },
  _loop() {
    if (!this.active) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this._lastT) / 1000);
    this._lastT = now;
    const cam = this._findCam();
    if (cam) {
      if (cam !== this._cam) {
        this._cam = cam;
        this._disableControls(cam);
        this._scale = this._sceneScale();
      }
      if (this._have) this._apply(cam);
      // Movimiento horizontal (joystick izq.) a lo largo de la vista, altura fija.
      if (this._moveX || this._moveZ) {
        const f = cam.forward;
        const r = cam.right;
        const fl = Math.hypot(f.x, f.z) || 1;
        const rl = Math.hypot(r.x, r.z) || 1;
        const speed = this._scale * 0.6;
        const p = cam.getPosition();
        const nx = p.x + ((f.x / fl) * this._moveZ + (r.x / rl) * this._moveX) * speed * dt;
        const nz = p.z + ((f.z / fl) * this._moveZ + (r.z / rl) * this._moveX) * speed * dt;
        cam.setPosition(nx, p.y, nz);
      }
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
  // En cualquier dispositivo táctil. Si el sensor no está disponible o el permiso
  // se deniega, se avisa al tocar el botón (no se oculta por eso).
  if (btn && IS_TOUCH) {
    btn.hidden = false;
    btn.addEventListener('click', () => gyroMode.toggle());
  }
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

// Arranca el sonido ambiental en el primer gesto del usuario (iOS exige gesto) y
// precarga la música, para que al iniciar el recorrido ya esté bufferada.
function setupAmbientUnlock() {
  const u = () => {
    ambientPlayer.unlock();
    musicPlayer.preload();
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach((ev) =>
    window.addEventListener(ev, u, { passive: true })
  );
}

function boot() {
  snapshotInitialDom(); // ANTES de cargar nada: todo lo que trae la página se conserva
  buildSceneMenu();
  setupTourButton();
  setupGyroButton();
  setupIdleHide();
  setupAmbientUnlock();
  setupMuteButton();
  callouts.init();
  // Escena inicial: la fija la página huésped (producto) o el parámetro ?scene=
  // (el mapa de la red enlaza cada filial a su cápsula). Por defecto, la primera.
  const wantId =
    (typeof window !== 'undefined' && window.__L360_SCENE) ||
    new URLSearchParams(location.search).get('scene');
  selectScene(SCENES.find((s) => s.id === wantId) || SCENES[0]);
}

// Botón para apagar/encender manualmente el sonido ambiente.
function setupMuteButton() {
  const btn = document.getElementById('mute-btn');
  const icon = document.getElementById('mute-icon');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const muted = ambientPlayer.toggleMuted();
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
    btn.classList.toggle('muted', muted);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
