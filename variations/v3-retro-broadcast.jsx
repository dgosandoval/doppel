// V3 — Retro Broadcast (Claro)
// Direction: base crema + paleta vintage de los '70, usa el ADN visual de
// Pod Factory (rayas, tipografía geométrica bold) como lenguaje común.
// Más cálido y humano. Evoca radios antiguas, cine análogo, tape covers.
// Tipografía: Archivo (bold geometrical) + Instrument Serif (romantic accent).

const V3 = {
  bg: '#F5EBD6',       // Pod Factory cream
  ink: '#1A1817',      // near-black warm
  blue: '#1F3FA3',
  red: '#D92E2E',
  orange: '#EF6A1F',
  yellow: '#F4B81C',
  mint: '#99CCCC',
  display: "'Archivo', sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'Space Mono', monospace",
};

function V3Rays({ height = 8, gap = 2, width = '100%', vertical = false }) {
  const colors = [V3.blue, V3.red, V3.orange, V3.yellow];
  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'row' : 'column',
      gap, width,
      ...(vertical ? { height: '100%' } : {}),
    }}>
      {colors.map(c => (
        <div key={c} style={{
          background: c,
          ...(vertical ? { width: height, height: '100%' } : { height, width: '100%' }),
        }} />
      ))}
    </div>
  );
}

function V3Home() {
  return (
    <div style={{ background: V3.bg, color: V3.ink, fontFamily: V3.display, minHeight: '100%' }}>
      <SiteChrome url="doppel.cl" bg="#ecdfc3" fg={V3.ink} />

      {/* Top ticker — retro broadcast feel */}
      <div style={{
        background: V3.ink, color: V3.bg, padding: '6px 32px',
        fontSize: 11, fontFamily: V3.mono, letterSpacing: '0.12em',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>●&nbsp;&nbsp;ON AIR — STUDIO A · 15:42</span>
        <span>DOPPEL MEDIA + POD FACTORY · SCL · EST. 2014</span>
        <span>FM 104.2 ↝ WWW.DOPPEL.CL</span>
      </div>

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 32px', borderBottom: `1.5px solid ${V3.ink}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <V3Rays height={5} gap={2} width={48} />
          <div style={{ fontFamily: V3.display, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
            doppel <span style={{ fontFamily: V3.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', verticalAlign: 'middle' }}>MEDIA</span>
            <span style={{ fontFamily: V3.serif, fontStyle: 'italic', fontWeight: 400, color: V3.red, fontSize: 22 }}> &amp; </span>
            pod factory
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }}>
          {['Trabajos', 'Podcasts', 'Estudio', 'Servicios', 'Contacto'].map(l => (
            <a key={l} style={{ color: V3.ink, textDecoration: 'none' }}>{l}</a>
          ))}
        </nav>
        <button style={{
          background: V3.red, color: V3.bg, border: 'none', padding: '10px 18px',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
          fontFamily: V3.display, cursor: 'pointer',
        }}>
          RESERVAR HORA
        </button>
      </header>

      {/* Hero — poster vibes */}
      <section style={{
        padding: '50px 32px 40px', position: 'relative',
        display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40,
      }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: V3.mono, letterSpacing: '0.18em', marginBottom: 18 }}>
            ▸&nbsp; VOL. 12 · VERANO 2026
          </div>
          <h1 style={{
            fontFamily: V3.display, fontWeight: 900, fontSize: 118, lineHeight: 0.86,
            letterSpacing: '-0.045em', margin: 0,
          }}>
            Historias<br />
            <span style={{ fontFamily: V3.serif, fontStyle: 'italic', fontWeight: 400 }}>bien</span>
            <span> contadas,</span><br />
            en <span style={{ color: V3.red }}>pantalla</span><br />
            y en <span style={{ color: V3.blue }}>onda.</span>
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.5, maxWidth: 520, marginTop: 28, fontWeight: 400,
          }}>
            Doppel Media es agencia productora y casa de contenido propio.
            Pod Factory es su estudio de vodcast. Mismo equipo, mismo criterio,
            dos formas de contar. Desde 2014 en Santiago.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
            <button style={{
              background: V3.ink, color: V3.bg, border: 'none', padding: '14px 22px',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: V3.display,
            }}>VER EL REEL →</button>
            <button style={{
              background: 'transparent', color: V3.ink, border: `1.5px solid ${V3.ink}`,
              padding: '14px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
              cursor: 'pointer', fontFamily: V3.display,
            }}>ESCUCHAR ÚLTIMO EP</button>
          </div>
        </div>

        {/* Poster composition — visually anchoring with rays + shapes */}
        <div style={{ position: 'relative', minHeight: 480 }}>
          {/* Vinyl / record */}
          <div style={{
            position: 'absolute', top: 20, right: 20, width: 280, height: 280,
            borderRadius: '50%', background: V3.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          }}>
            <div style={{
              position: 'absolute', inset: 24, borderRadius: '50%',
              border: `1px solid ${V3.bg}20`,
            }} />
            <div style={{
              position: 'absolute', inset: 48, borderRadius: '50%',
              border: `1px solid ${V3.bg}15`,
            }} />
            <div style={{
              width: 110, height: 110, borderRadius: '50%', background: V3.red,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: V3.bg, fontFamily: V3.display, fontWeight: 800, fontSize: 13,
              textAlign: 'center', letterSpacing: '-0.01em',
            }}>
              POD<br/>FACTORY
              <div style={{
                position: 'absolute', width: 12, height: 12, borderRadius: '50%',
                background: V3.ink, border: `2px solid ${V3.bg}`,
              }} />
            </div>
          </div>

          {/* Film strip peeking from bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: 220, height: 140,
            background: V3.ink, padding: '10px 0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 6px', marginBottom: 6 }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: 14, height: 10, background: V3.bg }} />)}
            </div>
            <div style={{ display: 'flex', gap: 3, padding: '0 6px' }}>
              <div style={{ flex: 1, aspectRatio: '4/3', background: V3.orange }} />
              <div style={{ flex: 1, aspectRatio: '4/3', background: V3.blue }} />
              <div style={{ flex: 1, aspectRatio: '4/3', background: V3.yellow }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 6px', marginTop: 6 }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: 14, height: 10, background: V3.bg }} />)}
            </div>
          </div>

          {/* Stamp */}
          <div style={{
            position: 'absolute', top: 260, left: 30,
            width: 140, height: 140, borderRadius: '50%',
            border: `2px solid ${V3.ink}`, color: V3.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'rotate(-12deg)', background: V3.yellow,
            fontFamily: V3.display, fontWeight: 800, fontSize: 13, textAlign: 'center',
            lineHeight: 1.1,
          }}>
            HECHO<br/>EN<br/>SANTIAGO<br/>· CHILE ·
          </div>

          {/* Vertical rays */}
          <div style={{ position: 'absolute', top: 0, left: 0, height: 180, width: 44 }}>
            <V3Rays vertical height={9} gap={3} />
          </div>
        </div>
      </section>

      {/* Featured work — magazine-style index */}
      <section style={{
        padding: '50px 32px', borderTop: `1.5px solid ${V3.ink}`, borderBottom: `1.5px solid ${V3.ink}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h2 style={{
            fontFamily: V3.display, fontWeight: 800, fontSize: 56,
            letterSpacing: '-0.035em', margin: 0,
          }}>
            Trabajos <span style={{ fontFamily: V3.serif, fontStyle: 'italic', fontWeight: 400, color: V3.red }}>en cartelera</span>
          </h2>
          <span style={{ fontFamily: V3.mono, fontSize: 12, letterSpacing: '0.1em' }}>
            06 DE 184 →
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {PROJECTS.map((p, i) => {
            const accent = [V3.red, V3.blue, V3.orange, V3.yellow, V3.red, V3.blue][i];
            return (
              <div key={i}>
                <VideoTile
                  bg={V3.ink} fg={V3.bg} aspect="5/6"
                  corner={`N°${String(i + 1).padStart(2, '0')}`}
                />
                <div style={{ paddingTop: 10, borderTop: `2px solid ${accent}`, marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontFamily: V3.display, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>
                      {p.title}
                    </div>
                    <div style={{ fontFamily: V3.mono, fontSize: 11 }}>{p.year}</div>
                  </div>
                  <div style={{ fontSize: 11, color: V3.ink + '99', fontFamily: V3.mono, letterSpacing: '0.06em', marginTop: 4 }}>
                    {p.client.toUpperCase()} ·· {p.type.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pod Factory takeover — styled like a radio show listing */}
      <section style={{ padding: '70px 32px', background: V3.ink, color: V3.bg, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40, alignItems: 'start' }}>
          <div>
            <V3Rays height={12} gap={3} width={160} />
            <div style={{
              fontSize: 11, fontFamily: V3.mono, letterSpacing: '0.2em',
              color: V3.yellow, marginTop: 24, marginBottom: 12,
            }}>
              ◉&nbsp; POD FACTORY ·· VODCAST STUDIO · UNA LÍNEA DE DOPPEL MEDIA
            </div>
            <h2 style={{
              fontFamily: V3.display, fontWeight: 900, fontSize: 92, lineHeight: 0.9,
              letterSpacing: '-0.04em', margin: 0,
            }}>
              En cabina,<br />
              en <span style={{ fontFamily: V3.serif, fontStyle: 'italic', fontWeight: 400, color: V3.yellow }}>locación,</span><br />
              o donde<br />la idea pida.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: V3.bg + 'cc', marginTop: 24, maxWidth: 440 }}>
              Estudio premium en Providencia con dos cabinas, cabina móvil, masterización
              incluida y un equipo que sabe cuándo apretar REC y cuándo aguantarse.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              <button style={{
                background: V3.yellow, color: V3.ink, border: 'none', padding: '14px 22px',
                fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: V3.display,
              }}>VER AGENDA</button>
              <button style={{
                background: 'transparent', color: V3.bg, border: `1.5px solid ${V3.bg}40`,
                padding: '14px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
                cursor: 'pointer', fontFamily: V3.display,
              }}>TOUR DEL ESTUDIO</button>
            </div>
          </div>

          {/* Podcast grid — cards w/ retro album-cover feel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {PODCASTS.map((p, i) => {
              const bg = [V3.red, V3.blue, V3.orange, V3.yellow][i];
              const fg = i === 3 ? V3.ink : V3.bg;
              return (
                <div key={i} style={{ background: bg, color: fg, padding: 20, position: 'relative', aspectRatio: '1/1' }}>
                  <div style={{ fontFamily: V3.mono, fontSize: 10, letterSpacing: '0.15em', opacity: 0.8 }}>
                    {p.ep}
                  </div>
                  <div style={{
                    fontFamily: V3.display, fontWeight: 800, fontSize: 28,
                    letterSpacing: '-0.02em', lineHeight: 1, marginTop: 10,
                  }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: V3.mono, marginTop: 10, opacity: 0.85 }}>
                    CON {p.host.toUpperCase()}
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', border: `1.5px solid ${fg}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 20 20" width="12" height="12"><path d="M7 5 L15 10 L7 15 Z" fill={fg} /></svg>
                    </div>
                    <span style={{ fontFamily: V3.mono, fontSize: 10 }}>38:14</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services — compact card row */}
      <section style={{ padding: '70px 32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <h2 style={{
            fontFamily: V3.display, fontWeight: 800, fontSize: 48,
            letterSpacing: '-0.035em', margin: 0,
          }}>
            Un equipo, <span style={{ fontFamily: V3.serif, fontStyle: 'italic', fontWeight: 400 }}>varios oficios</span>.
          </h2>
          <div style={{ fontFamily: V3.mono, fontSize: 11 }}>ÍNDICE · SERVICIOS</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            ['Concepto', 'Guion, estrategia, dirección de arte.', V3.red],
            ['Video', 'Spots, documentales, brand films.', V3.blue],
            ['Podcast', 'Cabina, móvil, producción integral.', V3.orange],
            ['Otros', 'Instalaciones, eventos, soportes físicos.', V3.yellow],
          ].map(([t, d, c], i) => (
            <div key={i} style={{ border: `1.5px solid ${V3.ink}`, padding: 0, background: V3.bg }}>
              <div style={{ height: 8, background: c }} />
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: V3.mono, fontSize: 11, letterSpacing: '0.1em', marginBottom: 14 }}>
                  0{i + 1}
                </div>
                <div style={{ fontFamily: V3.display, fontWeight: 800, fontSize: 28, letterSpacing: '-0.025em' }}>{t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.4, marginTop: 8, color: V3.ink + 'aa' }}>{d}</div>
                <div style={{ marginTop: 22, fontSize: 11, fontFamily: V3.mono, letterSpacing: '0.08em' }}>
                  LEER MÁS →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <section style={{ padding: '30px 32px 50px' }}>
        <div style={{ fontFamily: V3.mono, fontSize: 11, letterSpacing: '0.15em', marginBottom: 20 }}>
          ——— CLIENTES
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0,
          border: `1.5px solid ${V3.ink}`, background: V3.bg,
        }}>
          {CLIENTS.map((c, i) => (
            <div key={c} style={{
              padding: '22px 10px', textAlign: 'center',
              fontFamily: V3.display, fontWeight: 700, fontSize: 15,
              letterSpacing: '0.02em',
              borderRight: (i + 1) % 8 !== 0 ? `1px solid ${V3.ink}30` : 'none',
            }}>{c}</div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: V3.ink, color: V3.bg, padding: '50px 32px 24px' }}>
        <V3Rays height={10} gap={3} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32,
          marginTop: 36, paddingBottom: 28, borderBottom: `1px solid ${V3.bg}25`,
        }}>
          <div>
            <div style={{ fontFamily: V3.display, fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em' }}>
              doppel media<span style={{ fontFamily: V3.serif, fontStyle: 'italic', fontWeight: 400, color: V3.yellow }}> &amp; </span>pod factory
            </div>
            <div style={{ fontSize: 11, fontFamily: V3.mono, letterSpacing: '0.15em', color: V3.yellow, marginTop: 8 }}>
              AGENCIA PRODUCTORA · CASA DE CONTENIDO · ESTUDIO DE VODCAST
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 360, marginTop: 12, color: V3.bg + 'bb' }}>
              Agencia productora + estudio de podcast. Ideas que se ven y se oyen,
              desde Santiago de Chile.
            </p>
          </div>
          {[
            ['ESTUDIO', ['Av. Providencia 1234', 'Of. 502 · Santiago', 'Lun–Vie 9:30–19:00']],
            ['CONTACTO', ['hola@doppel.cl', '+56 2 2345 6789', 'Agenda un call']],
            ['SEGUIR', ['Instagram', 'Vimeo', 'Spotify', 'LinkedIn']],
          ].map(([h, items]) => (
            <div key={h}>
              <div style={{ fontFamily: V3.mono, fontSize: 11, letterSpacing: '0.15em', color: V3.yellow, marginBottom: 12 }}>{h}</div>
              {items.map(it => <div key={it} style={{ fontSize: 13, marginBottom: 6, color: V3.bg + 'dd' }}>{it}</div>)}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 20, display: 'flex', justifyContent: 'space-between',
          fontSize: 11, fontFamily: V3.mono, color: V3.bg + '88', letterSpacing: '0.08em',
        }}>
          <span>© 2014 — 2026 · DOPPEL MEDIA SPA · POD FACTORY ES UNA LÍNEA DE DOPPEL MEDIA</span>
          <span>MADE WITH COFFEE IN SCL ·· v.12</span>
        </div>
      </footer>
    </div>
  );
}

window.V3Home = V3Home;
