// V2 — Split Brutal
// Direction: ambas marcas con igual peso, unidas por un lenguaje de rayas
// horizontales (referencia directa al logo de Pod Factory como ADN común).
// Tipografía display MUY grande, layout bi-partido con transición diagonal.
// Paleta alta saturación: negro + los 4 colores de Pod Factory, orange Doppel
// como puente. Bricolage Grotesque para display bold.

const V2 = {
  bg: '#F5EBD6',         // Pod Factory cream
  ink: '#0A0A0A',
  blue: '#1F3FA3',
  red: '#D92E2E',
  orange: '#EF6A1F',     // Pod Factory orange (== Doppel orange essentially)
  yellow: '#F4B81C',
  mint: '#99CCCC',       // Doppel secondary, bridge color
  display: "'Bricolage Grotesque', sans-serif",
  sans: "'Archivo', sans-serif",
  mono: "'Space Mono', monospace",
};

// The defining element: 4-stripe rays, scalable
function V2Rays({ height = 10, width = '100%', gap = 3, flip = false, style = {} }) {
  const colors = flip
    ? [V2.yellow, V2.orange, V2.red, V2.blue]
    : [V2.blue, V2.red, V2.orange, V2.yellow];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, width, ...style }}>
      {colors.map(c => <div key={c} style={{ height, background: c, width: '100%' }} />)}
    </div>
  );
}

function V2Home() {
  return (
    <div style={{ background: V2.bg, color: V2.ink, fontFamily: V2.sans, minHeight: '100%' }}>
      <SiteChrome url="doppel.cl" bg="#ece1c9" fg={V2.ink} />

      {/* Top nav — minimal, content-first */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 36px', fontSize: 13, fontWeight: 500,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <V2Rays height={4} width={42} gap={2} />
          <span style={{ fontFamily: V2.display, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
            doppel media <span style={{ color: V2.red, fontWeight: 400 }}>+</span> pod factory
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 28, fontSize: 13 }}>
          {['Índice', 'Video', 'Podcast', 'Estudio', 'Contacto'].map(l => (
            <a key={l} style={{ color: V2.ink, textDecoration: 'none', fontWeight: 500 }}>{l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: V2.mono, fontSize: 11 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: V2.red }} />
          EN VIVO · ESTUDIO A
        </div>
      </header>

      {/* Hero: Two marks, one system */}
      <section style={{ padding: '32px 36px 0', position: 'relative' }}>
        <div style={{ fontSize: 12, fontFamily: V2.mono, letterSpacing: '0.15em', marginBottom: 18 }}>
          EST. 2014 ·· DOS ESTUDIOS, UN SOLO CRITERIO
        </div>

        {/* The big hero — bi-brand composition */}
        <div style={{ position: 'relative' }}>
          <h1 style={{
            fontFamily: V2.display, fontWeight: 800, fontSize: 200, lineHeight: 0.82,
            letterSpacing: '-0.055em', margin: 0, color: V2.ink,
          }}>
            Ideas<br />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              que
              <span style={{
                display: 'inline-block', height: 130, width: 200, marginTop: 12,
              }}>
                <V2Rays height={27} gap={4} />
              </span>
              se
            </span><br />
            <span style={{ color: V2.red, fontStyle: 'normal' }}>ven</span>
            <span style={{ color: V2.ink + '44' }}> y </span>
            <span style={{ color: V2.blue }}>se oyen.</span>
          </h1>
        </div>

        {/* Sub-hero band */}
        <div style={{
          marginTop: 40, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 32,
          paddingBottom: 32, borderBottom: `2px solid ${V2.ink}`,
        }}>
          <p style={{ fontSize: 17, lineHeight: 1.45, margin: 0, maxWidth: 520, fontWeight: 500 }}>
            Doppel Media es agencia productora y casa de contenido propio. Escribimos ideas
            y las materializamos: spots, documentales, vodcasts, instalaciones.
            El formato es la última decisión, no la primera.
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: V2.mono, letterSpacing: '0.12em', marginBottom: 4 }}>
                PRÓXIMO EN EL ESTUDIO
              </div>
              <div style={{ fontFamily: V2.display, fontSize: 22, fontWeight: 700, lineHeight: 1.05 }}>
                Rutas Paralelas · EP 43
              </div>
              <div style={{ fontSize: 12, color: V2.ink + '88', marginTop: 2 }}>Mar 26 · 15:00</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button style={{
              background: V2.ink, color: V2.bg, border: 'none', padding: '18px 26px',
              fontFamily: V2.display, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
              cursor: 'pointer', width: '100%',
            }}>
              Cuéntanos tu idea →
            </button>
          </div>
        </div>
      </section>

      {/* Split: Video side / Podcast side */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520 }}>
        {/* DOPPEL side — dark */}
        <div style={{ background: V2.ink, color: V2.bg, padding: '40px 36px 36px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: V2.mono, letterSpacing: '0.2em', color: V2.yellow, marginBottom: 6 }}>
                ——— DOPPEL / VIDEO
              </div>
              <div style={{ fontFamily: V2.display, fontSize: 52, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>
                El lado<br />que se ve.
              </div>
            </div>
            <a style={{ fontSize: 12, fontFamily: V2.mono, letterSpacing: '0.1em', color: V2.yellow }}>
              VER REEL →
            </a>
          </div>

          <VideoTile bg="#1a1a1a" fg={V2.bg} aspect="16/9" corner="FEATURED · 2025" style={{ marginBottom: 18 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {PROJECTS.slice(0, 3).map((p, i) => (
              <div key={i}>
                <VideoTile bg={['#201a14', '#142030', '#1a1e14'][i]} fg={V2.bg} aspect="4/5" />
                <div style={{ fontSize: 11, marginTop: 6, fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 10, color: V2.bg + '80', fontFamily: V2.mono }}>{p.client.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* POD FACTORY side — the cream + rays */}
        <div style={{
          background: V2.bg, color: V2.ink, padding: '40px 36px 36px', position: 'relative',
          borderLeft: `2px solid ${V2.ink}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: V2.mono, letterSpacing: '0.2em', color: V2.red, marginBottom: 6 }}>
                ——— POD FACTORY / VODCAST · UNA LÍNEA DE DOPPEL MEDIA
              </div>
              <div style={{ fontFamily: V2.display, fontSize: 52, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>
                El lado<br />que se oye.
              </div>
            </div>
            <a style={{ fontSize: 12, fontFamily: V2.mono, letterSpacing: '0.1em', color: V2.red }}>
              RESERVAR →
            </a>
          </div>

          {/* Studio tile with logo-like composition */}
          <div style={{
            aspectRatio: '16/9', background: V2.ink, position: 'relative', overflow: 'hidden',
            marginBottom: 18, display: 'flex', alignItems: 'center', padding: 22, gap: 20,
          }}>
            <PodMic size={96} color={V2.bg} />
            <V2Rays height={20} gap={3} style={{ flex: 1 }} />
            <div style={{ position: 'absolute', bottom: 14, right: 16, fontSize: 10, fontFamily: V2.mono, color: V2.bg, letterSpacing: '0.1em' }}>
              STUDIO A · PROVIDENCIA
            </div>
          </div>

          {/* Booking widget */}
          <div style={{ border: `1.5px solid ${V2.ink}`, padding: 0 }}>
            <div style={{
              padding: '10px 14px', background: V2.ink, color: V2.bg,
              fontSize: 11, fontFamily: V2.mono, letterSpacing: '0.12em',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>RESERVA RÁPIDA</span>
              <span>MAR 26</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: `1px solid ${V2.ink}30` }}>
              {['10', '11', '12', '13', '14', '15'].map((h, i) => (
                <div key={h} style={{
                  padding: '12px 0', textAlign: 'center', fontSize: 13, fontWeight: 600,
                  borderRight: i < 5 ? `1px solid ${V2.ink}30` : 'none',
                  background: i === 2 ? V2.yellow : i === 4 ? V2.red : 'transparent',
                  color: i === 4 ? V2.bg : V2.ink,
                  fontFamily: V2.mono,
                }}>
                  {h}:00
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
              {['16', '17', '18', '19', '20', '21'].map((h, i) => (
                <div key={h} style={{
                  padding: '12px 0', textAlign: 'center', fontSize: 13, fontWeight: 600,
                  borderRight: i < 5 ? `1px solid ${V2.ink}30` : 'none',
                  background: i === 1 ? V2.blue : 'transparent',
                  color: i === 1 ? V2.bg : V2.ink,
                  fontFamily: V2.mono,
                }}>
                  {h}:00
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', gap: 14, fontSize: 11, fontFamily: V2.mono }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 9, height: 9, background: V2.yellow }} />DISPONIBLE
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 9, height: 9, background: V2.red }} />OCUPADO
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 9, height: 9, background: V2.blue }} />TENTATIVO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width ray divider */}
      <V2Rays height={14} gap={3} style={{ marginTop: 0 }} />

      {/* Services — numbered, big */}
      <section style={{ padding: '80px 36px 60px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10,
        }}>
          <div style={{ fontSize: 12, fontFamily: V2.mono, letterSpacing: '0.15em' }}>
            003 ·· LO QUE HACEMOS
          </div>
          <div style={{ fontSize: 12, fontFamily: V2.mono, color: V2.ink + '88' }}>
            (&nbsp;todo empieza en una idea&nbsp;)
          </div>
        </div>

        {[
          ['01', 'Concepto creativo', 'Escribimos la idea antes de filmarla. Estrategia, guion, dirección de arte.', V2.red],
          ['02', 'Producción audiovisual', 'Comerciales, brand films, documentales. Fichamos al equipo perfecto.', V2.blue],
          ['03', 'Producción de podcast', 'Cabina en Providencia + set móvil para tu locación. Masterizado incluido.', V2.orange],
          ['04', 'Otros soportes', 'Instalaciones, activaciones, piezas para pantalla chica o gigantografía.', V2.yellow],
        ].map(([n, t, d, c], i) => (
          <div key={n} style={{
            display: 'grid', gridTemplateColumns: '60px 1.5fr 2fr 60px',
            alignItems: 'center', gap: 28, padding: '28px 0',
            borderTop: `1.5px solid ${V2.ink}`,
            borderBottom: i === 3 ? `1.5px solid ${V2.ink}` : 'none',
          }}>
            <div style={{ fontFamily: V2.mono, fontSize: 14, fontWeight: 700 }}>({n})</div>
            <div style={{
              fontFamily: V2.display, fontWeight: 700, fontSize: 46,
              letterSpacing: '-0.03em', lineHeight: 1,
            }}>{t}</div>
            <div style={{ fontSize: 15, lineHeight: 1.4, color: V2.ink + 'cc' }}>{d}</div>
            <div style={{ width: 40, height: 40, background: c, marginLeft: 'auto' }} />
          </div>
        ))}
      </section>

      {/* Clients wall */}
      <section style={{ background: V2.ink, color: V2.bg, padding: '50px 36px' }}>
        <div style={{ fontSize: 12, fontFamily: V2.mono, letterSpacing: '0.15em', color: V2.yellow, marginBottom: 28 }}>
          004 ·· CLIENTES QUE SE ATREVIERON
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0, border: `1px solid ${V2.bg}20`,
        }}>
          {CLIENTS.map((c, i) => (
            <div key={c} style={{
              padding: '34px 20px', textAlign: 'center',
              fontFamily: V2.display, fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em',
              borderRight: (i + 1) % 4 !== 0 ? `1px solid ${V2.bg}20` : 'none',
              borderBottom: i < 4 ? `1px solid ${V2.bg}20` : 'none',
            }}>{c}</div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '70px 36px 20px', background: V2.yellow }}>
        <h3 style={{
          fontFamily: V2.display, fontWeight: 800, fontSize: 150,
          letterSpacing: '-0.055em', margin: 0, lineHeight: 0.85,
        }}>
          Mándanos<br />un brief.
        </h3>
        <div style={{
          marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingTop: 20, borderTop: `2px solid ${V2.ink}`,
        }}>
          <div style={{ fontSize: 14, fontFamily: V2.mono }}>
            hola@doppel.cl · +56 2 2345 6789
          </div>
          <div style={{ fontSize: 14, fontFamily: V2.mono, textAlign: 'right' }}>
            Av. Providencia 1234, of. 502<br />Santiago, Chile
          </div>
        </div>
      </section>

      <V2Rays height={12} gap={3} />

      <footer style={{ padding: '20px 36px', background: V2.ink, color: V2.bg, fontSize: 11, fontFamily: V2.mono, letterSpacing: '0.08em', display: 'flex', justifyContent: 'space-between' }}>
        <span>© DOPPEL MEDIA — 2011/2026 · POD FACTORY ES UNA LÍNEA DE DOPPEL MEDIA</span>
        <span>IG · VIMEO · SPOTIFY · LINKEDIN</span>
      </footer>
    </div>
  );
}

window.V2Home = V2Home;
window.V2Rays = V2Rays;
