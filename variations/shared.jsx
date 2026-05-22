// Shared tokens & utilities for all three variations
// Common brand DNA distilled from the Doppel manual + Pod Factory logo

const BRAND = {
  doppel: {
    primary: '#3B3D49',    // charcoal blue-gray
    mint: '#99CCCC',
    orange: '#FF6633',
    yellow: '#FFCC33',
    name: 'doppel',
    tag: 'MEDIA',
  },
  pod: {
    blue: '#1F3FA3',
    red: '#D92E2E',
    orange: '#EF6A1F',
    yellow: '#F4B81C',
    cream: '#F5EBD6',
    black: '#0A0A0A',
  },
};

// Real client logos from the current site (as short wordmarks for placeholders)
const CLIENTS = ['WALMART', 'CHEVROLET', 'FORD', 'PETROBRAS', 'ENTEL', 'ENEL', 'DERCO', 'LATAM'];

// Project titles used across variations — invented but plausible for a Chilean
// audiovisual production house. Keep them short and punchy.
const PROJECTS = [
  { title: 'Entel · Redes del Futuro',     type: 'Spot TV',        year: '2025', client: 'Entel' },
  { title: 'Ford Ranger · Territorio',     type: 'Brand Film',     year: '2025', client: 'Ford' },
  { title: 'LATAM · Rutas de América',     type: 'Documental',     year: '2024', client: 'LATAM' },
  { title: 'Walmart · Nuestra Gente',      type: 'Campaña',        year: '2024', client: 'Walmart' },
  { title: 'Derco · Arena y Polvo',        type: 'Comercial',      year: '2024', client: 'Derco' },
  { title: 'Enel · Energía Viva',          type: 'Brand Film',     year: '2023', client: 'Enel' },
];

const PODCASTS = [
  { title: 'Rutas Paralelas',   host: 'Camila Rojas',   ep: 'EP · 42' },
  { title: 'Negocios de Barrio', host: 'Matías Vera',   ep: 'EP · 17' },
  { title: 'La Hora Azul',       host: 'Fran & Joaquín', ep: 'EP · 08' },
  { title: 'Cocina en Vivo',     host: 'Paz Donoso',    ep: 'EP · 23' },
];

// Hero carousel images — URLs or paths to carousel photos
const CAROUSEL_IMAGES = [
  { src: 'assets/FORD RAPTOR.jpg', label: 'Ford Performance' },
  { src: 'assets/ENTEL.jpg', label: 'Redes del Futuro' },
  { src: 'assets/TÉ CLUB.jpg', label: 'Sostenibilidad' },
  { src: 'assets/FORD CHILE.jpg', label: 'Lanzamientos' },
];

// ── Small primitives ──────────────────────────────────────────
// Video placeholder — diagonal hatching + play glyph. Looks intentional,
// reads as "video here" without faking a screengrab.
function VideoTile({ bg = '#1a1a1a', fg = '#fff', children, aspect = '16/9', style = {}, corner }) {
  return (
    <div style={{
      position: 'relative', aspectRatio: aspect, background: bg, color: fg,
      overflow: 'hidden', ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, ${fg}0d 14px 15px)`,
      }} />
      <svg viewBox="0 0 40 40" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', width: 44, height: 44,
        opacity: 0.85,
      }}>
        <circle cx="20" cy="20" r="19" fill="none" stroke={fg} strokeWidth="1" />
        <path d="M16 13 L28 20 L16 27 Z" fill={fg} />
      </svg>
      {corner && (
        <div style={{
          position: 'absolute', top: 12, left: 12, fontSize: 10,
          letterSpacing: '0.12em', fontWeight: 600, color: fg, opacity: 0.85,
          fontFamily: 'Space Mono, monospace',
        }}>{corner}</div>
      )}
      {children}
    </div>
  );
}

// Pod Factory "sound bars" glyph — direct reference to the logo rays
function PodBars({ colors = ['#1F3FA3', '#D92E2E', '#EF6A1F', '#F4B81C'], height = 6, width = 60 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width }}>
      {colors.map((c, i) => (
        <div key={i} style={{ height, background: c, width: `${100 - i * 0}%` }} />
      ))}
    </div>
  );
}

// Pod Factory mic icon (simplified from logo)
function PodMic({ size = 28, color = '#F5EBD6' }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="14" fill="none" stroke={color} strokeWidth="1.8" />
      <circle cx="16" cy="16" r="9" fill="none" stroke={color} strokeWidth="1.8" />
      <circle cx="16" cy="16" r="4" fill={color} />
      <path d="M16 30 L13 38 L19 38 Z" fill={color} />
    </svg>
  );
}

// Doppel "pp" palindrome mark — typographic, reads as the wordmark
function DoppelMark({ size = 20, color = 'currentColor', font = "'Archivo', sans-serif" }) {
  return (
    <span style={{
      fontFamily: font, fontWeight: 700, fontSize: size, letterSpacing: '-0.04em',
      color, lineHeight: 1, display: 'inline-block',
    }}>doppel<span style={{ opacity: 0.45 }}>.</span></span>
  );
}

// Image carousel — swipe/click to navigate through hero images
function ImageCarousel({ images = CAROUSEL_IMAGES, autoplay = false, autoplayDelay = 5000 }) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, images.length]);
  
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);
  
  return (
    <div style={{
      position: 'relative', aspectRatio: '4/5', background: '#1a1a1a',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Current image */}
      {images[index]?.src ? (
        <img
          src={images[index].src}
          alt={images[index].label}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 14px, #fff0d 14px 15px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', color: '#fff8' }}>
            <div style={{ fontSize: 14, fontFamily: 'Space Mono, monospace' }}>
              {images[index]?.label || 'Imagen no disponible'}
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation arrows */}
      <button
        onClick={prev}
        style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          background: '#fff2', border: 'none', color: '#fff', width: 40, height: 40,
          borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20, zIndex: 2, transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = '#fff4'}
        onMouseLeave={e => e.target.style.background = '#fff2'}
      >
        ‹
      </button>
      <button
        onClick={next}
        style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          background: '#fff2', border: 'none', color: '#fff', width: 40, height: 40,
          borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20, zIndex: 2, transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = '#fff4'}
        onMouseLeave={e => e.target.style.background = '#fff2'}
      >
        ›
      </button>
      
      {/* Indicators */}
      <div style={{
        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6, zIndex: 2,
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: i === index ? '#fff' : '#fff6', transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
      
      {/* Label */}
      {images[index]?.label && (
        <div style={{
          position: 'absolute', top: 12, left: 12, fontSize: 10,
          letterSpacing: '0.12em', fontWeight: 600, color: '#fffa',
          fontFamily: 'Space Mono, monospace',
        }}>
          DOPPEL · {images[index].label.toUpperCase()}
        </div>
      )}
    </div>
  );
}

// A tiny "browser chrome" header so each artboard reads as a website
// without pulling the full browser-window starter (too chunky for our grid).
function SiteChrome({ url = 'doppel.cl', bg = '#e8e6e1', fg = '#3b3d49' }) {
  return (
    <div style={{
      height: 32, background: bg, display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 10, borderBottom: `1px solid ${fg}15`,
      fontFamily: 'Space Mono, monospace', fontSize: 11, color: fg + 'aa',
    }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {['#f56', '#fb5', '#4c5'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c + '99' }} />
        ))}
      </div>
      <div style={{
        flex: 1, textAlign: 'center', padding: '4px 10px',
        background: bg === '#e8e6e1' ? '#fff8' : '#0003', borderRadius: 6,
      }}>
        {url}
      </div>
    </div>
  );
}

Object.assign(window, {
  BRAND, CLIENTS, PROJECTS, PODCASTS, CAROUSEL_IMAGES,
  VideoTile, PodBars, PodMic, DoppelMark, SiteChrome, ImageCarousel,
});
