// Doppel Studio landing page — entry point for ad traffic.
// Must (a) be immersive in Studio's own world, (b) immediately signal
// "parte de Doppel" so users understand the brand hierarchy.
// Uses the studio palette (inherited from Pod Factory visual DNA) on cream.

const PF = {
  bg: '#F5EBD6',
  ink: '#0A0A0A',
  blue: '#1F3FA3',
  red: '#D92E2E',
  orange: '#EF6A1F',
  yellow: '#F4B81C',
  display: "'Archivo', sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'Space Mono', monospace",
};

function PFRays({ height = 10, gap = 3, width = '100%' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, width }}>
      {[PF.blue, PF.red, PF.orange, PF.yellow].map(c => (
        <div key={c} style={{ height, background: c, width: '100%' }} />
      ))}
    </div>
  );
}

function PodFactoryLanding() {
  return (
    <div style={{ background: PF.bg, color: PF.ink, fontFamily: PF.display, minHeight: '100%' }}>
      <SiteChrome url="doppel.cl/studio" bg="#ecdfc3" fg={PF.ink} />

      {/* PARENT BRAND BAR — the most critical piece for ad traffic.
          Makes it instantly clear this is Doppel's podcast studio. */}
      <div style={{
        background: PF.ink, color: PF.bg, padding: '10px 32px',
        fontSize: 12, fontFamily: PF.mono, letterSpacing: '0.1em',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: PF.bg + '80' }}>ESTÁS EN</span>
          <span style={{ fontWeight: 700 }}>DOPPEL STUDIO</span>
          <span style={{ color: PF.bg + '50' }}>→ PARTE DE</span>
          <a style={{
            color: PF.yellow, fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>DOPPEL ↗</a>
          <span style={{ color: PF.bg + '50', marginLeft: 6 }}>(productora + estudio)</span>
        </div>
        <span style={{ color: PF.bg + '80' }}>PROVIDENCIA · SANTIAGO</span>
      </div>

      {/* Header with Doppel logo + STUDIO division marker */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 32px', borderBottom: `1.5px solid ${PF.ink}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="assets/doppel-logo.png" alt="Doppel" style={{ height: 24, display: 'block' }} />
          <div style={{
            paddingLeft: 14, borderLeft: `1.5px solid ${PF.ink}30`,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <div style={{ fontFamily: PF.display, fontSize: 22, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>
              Studio
            </div>
            <div style={{ fontFamily: PF.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: PF.ink + '99' }}>
              PODCAST · VODCAST
            </div>
          </div>
          <PFRays height={5} gap={2} width={50} />
        </div>
        <nav style={{ display: 'flex', gap: 26, fontSize: 13, fontWeight: 500 }}>
          {['El espacio', 'Servicios', 'Producciones', 'Tarifas', 'Contacto'].map(l => (
            <a key={l} style={{ color: PF.ink, textDecoration: 'none' }}>{l}</a>
          ))}
        </nav>
        <button style={{
          background: PF.red, color: PF.bg, border: 'none', padding: '12px 22px',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
          fontFamily: PF.display, cursor: 'pointer',
        }}>
          RESERVAR →
        </button>
      </header>

      {/* Hero */}
      <section style={{ padding: '50px 32px 30px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: PF.mono, letterSpacing: '0.18em', marginBottom: 18 }}>
            ▸ ESTUDIO DE PODCAST &amp; VODCAST · DESDE 2019
          </div>
          <h1 style={{
            fontFamily: PF.display, fontWeight: 900, fontSize: 126, lineHeight: 0.85,
            letterSpacing: '-0.045em', margin: 0,
          }}>
            Tu <span style={{ color: PF.red }}>podcast</span><br />
            en <span style={{ fontFamily: PF.serif, fontStyle: 'italic', fontWeight: 400 }}>cuatro</span> cámaras,<br />
            <span style={{ color: PF.blue }}>sin excusas.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.5, maxWidth: 540, marginTop: 28 }}>
            Cabina premium en Providencia con setup multicámara listo para vodcast,
            masterización incluida, y un equipo que ha producido sobre 300 episodios.
            Llegas, te sientas, grabas. Nosotros hacemos el resto.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
            <button style={{
              background: PF.ink, color: PF.bg, border: 'none', padding: '16px 26px',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: PF.display,
            }}>VER DISPONIBILIDAD →</button>
            <button style={{
              background: 'transparent', color: PF.ink, border: `1.5px solid ${PF.ink}`,
              padding: '16px 26px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
              cursor: 'pointer', fontFamily: PF.display,
            }}>TOUR VIRTUAL</button>
            <div style={{ fontSize: 11, fontFamily: PF.mono, color: PF.ink + 'aa', marginLeft: 8 }}>
              Desde<br /><b style={{ color: PF.ink, fontSize: 14 }}>$85.000 / hora</b>
            </div>
          </div>
        </div>

        {/* Studio preview tile */}
        <div style={{ position: 'relative' }}>
          <div style={{
            aspectRatio: '3/4', background: PF.ink, position: 'relative', overflow: 'hidden',
          }}>
            <VideoTile bg={PF.ink} fg={PF.bg} aspect="3/4" corner="STUDIO A · 360°" />
            <div style={{
              position: 'absolute', bottom: 14, left: 14, right: 14,
              background: PF.yellow, padding: '10px 14px',
              fontFamily: PF.mono, fontSize: 11, letterSpacing: '0.1em',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 700 }}>LIVE NOW</span>
              <span>RUTAS PARALELAS · EP 43</span>
            </div>
          </div>
          {/* Ray decoration */}
          <div style={{ position: 'absolute', top: -10, right: -10 }}>
            <PFRays height={8} gap={3} width={80} />
          </div>
        </div>
      </section>

      {/* Quick facts strip */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: `2px solid ${PF.ink}`, borderBottom: `2px solid ${PF.ink}`,
      }}>
        {[
          ['4', 'cámaras 4K', PF.blue],
          ['+300', 'episodios producidos', PF.red],
          ['24h', 'entrega masterizada', PF.orange],
          ['2', 'cabinas + móvil', PF.yellow],
        ].map(([n, l, c], i) => (
          <div key={i} style={{
            padding: '30px 20px', borderRight: i < 3 ? `1.5px solid ${PF.ink}` : 'none',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: c }} />
            <div style={{ fontFamily: PF.display, fontSize: 54, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: PF.mono, fontSize: 12, letterSpacing: '0.08em', marginTop: 6, color: PF.ink + 'aa' }}>
              {l.toUpperCase()}
            </div>
          </div>
        ))}
      </section>

      {/* What you get */}
      <section style={{ padding: '60px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <h2 style={{ fontFamily: PF.display, fontWeight: 800, fontSize: 48, letterSpacing: '-0.035em', margin: 0 }}>
            Qué incluye tu <span style={{ fontFamily: PF.serif, fontStyle: 'italic', fontWeight: 400, color: PF.red }}>sesión</span>
          </h2>
          <div style={{ fontFamily: PF.mono, fontSize: 11 }}>TODO INCLUIDO</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            ['Grabación multicámara 4K', 'Cuatro Sony FX3 con switcher en vivo. Entregamos bruto + master editado.', PF.blue],
            ['Audio broadcast', 'Micrófonos Shure SM7B, consola RØDECaster Pro II. Masterizado incluido.', PF.red],
            ['Dirección & producción', 'Un productor dedicado, guía de entrevista, y edición de primer corte.', PF.orange],
            ['Streaming opcional', 'Transmisión en vivo a YouTube, Spotify Video o tu plataforma.', PF.yellow],
            ['Cabina móvil', 'Llevamos el estudio donde estés. Ideal para entrevistas fuera de Santiago.', PF.blue],
            ['Distribución', 'Subimos por ti a Spotify, Apple Podcasts, YouTube, Amazon. Desde el EP 1.', PF.red],
          ].map(([t, d, c], i) => (
            <div key={i} style={{ border: `1.5px solid ${PF.ink}`, background: PF.bg }}>
              <div style={{ height: 6, background: c }} />
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: PF.mono, fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                  0{i + 1}
                </div>
                <div style={{ fontFamily: PF.display, fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>{t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.45, marginTop: 6, color: PF.ink + 'aa' }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productions showcase */}
      <section style={{ padding: '40px 32px 60px', background: PF.ink, color: PF.bg }}>
        <PFRays height={10} gap={3} width={180} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 22, marginBottom: 20 }}>
          <h2 style={{ fontFamily: PF.display, fontWeight: 800, fontSize: 46, letterSpacing: '-0.035em', margin: 0 }}>
            Se grabó aquí
          </h2>
          <a style={{ fontFamily: PF.mono, fontSize: 11, color: PF.yellow, letterSpacing: '0.1em' }}>
            VER TODAS →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {PODCASTS.map((p, i) => {
            const bg = [PF.red, PF.blue, PF.orange, PF.yellow][i];
            const fg = i === 3 ? PF.ink : PF.bg;
            return (
              <div key={i} style={{ background: bg, color: fg, padding: 18, aspectRatio: '1/1', position: 'relative' }}>
                <div style={{ fontFamily: PF.mono, fontSize: 10, letterSpacing: '0.15em', opacity: 0.8 }}>{p.ep}</div>
                <div style={{ fontFamily: PF.display, fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 8 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 11, fontFamily: PF.mono, marginTop: 8, opacity: 0.85 }}>
                  CON {p.host.toUpperCase()}
                </div>
                <div style={{ position: 'absolute', bottom: 14, right: 14, width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${fg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 20 20" width="10" height="10"><path d="M7 5 L15 10 L7 15 Z" fill={fg} /></svg>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking calendar snapshot */}
      <section style={{ padding: '60px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <h2 style={{ fontFamily: PF.display, fontWeight: 800, fontSize: 48, letterSpacing: '-0.035em', margin: 0 }}>
            Reserva tu hora
          </h2>
          <div style={{ fontFamily: PF.mono, fontSize: 12 }}>SEMANA DEL 23 AL 29 DE MAR</div>
        </div>

        <div style={{ border: `1.5px solid ${PF.ink}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: PF.ink, color: PF.bg }}>
            {['LUN 23', 'MAR 24', 'MIÉ 25', 'JUE 26', 'VIE 27', 'SÁB 28', 'DOM 29'].map((d, i) => (
              <div key={d} style={{
                padding: '10px 12px', fontFamily: PF.mono, fontSize: 11, letterSpacing: '0.08em',
                borderRight: i < 6 ? `1px solid ${PF.bg}20` : 'none',
              }}>{d}</div>
            ))}
          </div>
          {['10:00', '12:00', '14:00', '16:00', '18:00'].map((h, row) => (
            <div key={h} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderTop: row > 0 ? `1px solid ${PF.ink}25` : 'none' }}>
              <div style={{ padding: '14px 12px', fontFamily: PF.mono, fontSize: 11, borderRight: `1px solid ${PF.ink}25`, background: PF.bg }}>
                {h}
              </div>
              {[0,1,2,3,4,5,6].map(col => {
                const states = [
                  ['','','','','bk','',''],
                  ['','bk','','','','',''],
                  ['','','hold','','bk','',''],
                  ['bk','','','bk','','',''],
                  ['','','','','','hold',''],
                ];
                const s = states[row][col];
                const bg = s === 'bk' ? PF.red : s === 'hold' ? PF.blue : 'transparent';
                const color = s ? PF.bg : PF.ink;
                return (
                  <div key={col} style={{
                    padding: '14px 10px', fontSize: 11, fontFamily: PF.mono,
                    background: bg, color, borderRight: col < 6 ? `1px solid ${PF.ink}25` : 'none',
                    cursor: s ? 'default' : 'pointer',
                  }}>
                    {s === 'bk' ? 'RESERVADO' : s === 'hold' ? 'TENTATIVO' : '—'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 18, marginTop: 14, fontSize: 11, fontFamily: PF.mono }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: 'transparent', border: `1px solid ${PF.ink}` }} /> DISPONIBLE
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: PF.red }} /> RESERVADO
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: PF.blue }} /> TENTATIVO
          </span>
        </div>
      </section>

      {/* Cross-sell to Doppel Media — key for brand architecture */}
      <section style={{ padding: '60px 32px', background: PF.yellow }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: PF.mono, fontSize: 11, letterSpacing: '0.2em', marginBottom: 14 }}>
              ▸ ¿NECESITAS MÁS QUE UN PODCAST?
            </div>
            <h2 style={{
              fontFamily: PF.display, fontWeight: 900, fontSize: 72,
              letterSpacing: '-0.04em', margin: 0, lineHeight: 0.9,
            }}>
              Studio es parte de <span style={{ fontFamily: PF.serif, fontStyle: 'italic', fontWeight: 400 }}>Doppel Media</span>.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.5, marginTop: 22, maxWidth: 480 }}>
              Si tu proyecto necesita spots, documentales, brand films o cualquier pieza
              audiovisual más allá del podcast, te atiende el mismo equipo desde
              Doppel Media. Mismo edificio, misma gente.
            </p>
            <button style={{
              marginTop: 24, background: PF.ink, color: PF.bg, border: 'none',
              padding: '16px 26px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
              cursor: 'pointer', fontFamily: PF.display,
            }}>
              CONOCER DOPPEL MEDIA →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {PROJECTS.slice(0, 4).map((p, i) => (
              <div key={i}>
                <VideoTile bg={PF.ink} fg={PF.bg} aspect="4/5" corner={p.client.toUpperCase()} />
                <div style={{ fontSize: 11, fontFamily: PF.mono, marginTop: 6 }}>
                  {p.type.toUpperCase()} · {p.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: PF.ink, color: PF.bg, padding: '40px 32px 24px' }}>
        <PFRays height={8} gap={2} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 24,
          marginTop: 30, paddingBottom: 24, borderBottom: `1px solid ${PF.bg}25`,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <img src="assets/doppel-logo.png" alt="Doppel" style={{ height: 22, display: 'block', filter: 'invert(94%) sepia(8%) saturate(120%) hue-rotate(347deg) brightness(98%) contrast(94%)' }} />
              <span style={{
                fontFamily: PF.display, fontWeight: 800, fontSize: 22, letterSpacing: '-0.025em',
                paddingLeft: 10, borderLeft: `1.5px solid ${PF.bg}30`,
              }}>
                Studio
              </span>
            </div>
            <div style={{ fontSize: 12, fontFamily: PF.mono, letterSpacing: '0.1em', color: PF.yellow }}>
              DIVISIÓN DE DOPPEL ↗
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.5, maxWidth: 320, marginTop: 12, color: PF.bg + 'aa' }}>
              Estudio de podcast y vodcast en Providencia, Santiago. Parte del
              ecosistema Doppel: la productora audiovisual + la casa de contenido.
            </p>
          </div>
          {[
            ['ESTUDIO', ['Av. Providencia 1234', 'Of. 502 · Santiago', 'Lun–Sáb · Reserva online']],
            ['RESERVAS', ['studio@doppel.cl', '+56 2 2345 6789', 'WhatsApp']],
            ['DOPPEL MEDIA', ['Agencia productora', 'Contenido propio', 'Ver proyectos ↗']],
          ].map(([h, items]) => (
            <div key={h}>
              <div style={{ fontFamily: PF.mono, fontSize: 10, letterSpacing: '0.15em', color: PF.yellow, marginBottom: 10 }}>{h}</div>
              {items.map(it => <div key={it} style={{ fontSize: 12, marginBottom: 5, color: PF.bg + 'dd' }}>{it}</div>)}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: PF.mono, letterSpacing: '0.08em', color: PF.bg + '88' }}>
          <span>© DOPPEL SPA · 2014—2026 · STUDIO + MEDIA</span>
          <span>IG · YOUTUBE · SPOTIFY · TIKTOK</span>
        </div>
      </footer>
    </div>
  );
}

window.PodFactoryLanding = PodFactoryLanding;
