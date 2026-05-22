// V1 — Editorial Dark (Camino A: Doppel como agencia 360°)
// Doppel = agencia creativa que parte desde la idea (concepto, guion,
// estrategia) y se materializa en Media (audiovisual) o Studio (podcast).
// Paléta: negro/crema + acento naranja Doppel.
// Tipografía: Fraunces (display editorial) + Archivo (UI).

const V1 = {
  bg: '#0E0E0E',
  paper: '#F4EFE6',
  ink: '#141414',
  muted: '#8B8883',
  accent: '#FF6633',   // Doppel orange
  podAccent: '#F4B81C', // Pod Factory yellow as bridge
  display: "'Fraunces', serif",
  sans: "'Archivo', sans-serif",
  mono: "'Space Mono', monospace",
};

function V1Home() {
  return (
    <div style={{ background: V1.bg, color: V1.paper, fontFamily: V1.sans, minHeight: '100%' }}>
      <SiteChrome url="doppel.cl" bg="#1a1a1a" fg="#F4EFE6" />

      {/* Nav */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 40px', borderBottom: `1px solid ${V1.paper}15`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="assets/doppel-logo.png" alt="Doppel" style={{ height: 26, display: 'block', filter: 'invert(94%) sepia(8%) saturate(120%) hue-rotate(347deg) brightness(98%) contrast(94%)' }} />
          <span style={{
            fontFamily: V1.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
            color: V1.muted, paddingLeft: 12, borderLeft: `1px solid ${V1.paper}25`,
            lineHeight: 1.3,
          }}>AGENCIA<br />CREATIVA</span>
        </div>
        <nav style={{ display: 'flex', gap: 26, fontSize: 13, letterSpacing: '0.04em' }}>
          {['Trabajos', 'Cómo trabajamos', 'Media', 'Studio', 'Nosotros', 'Contacto'].map(l => (
            <a key={l} style={{ color: V1.paper, textDecoration: 'none' }}>{l}</a>
          ))}
        </nav>
        <button style={{
          background: V1.paper, color: V1.ink, border: 'none', padding: '10px 18px',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer',
          fontFamily: V1.sans,
        }}>BRIEF →</button>
      </header>

      {/* Hero */}
      <section style={{ padding: '60px 40px 40px', position: 'relative' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 11, fontFamily: V1.mono, color: V1.muted, letterSpacing: '0.1em' }}>
            ( 001 / AGENCIA CREATIVA 360° · SCL )
          </div>
          <div style={{ fontSize: 11, fontFamily: V1.mono, color: V1.muted }}>
            SANTIAGO · 24°C · 18:42
          </div>
        </div>

        <h1 style={{
          fontFamily: V1.display, fontWeight: 300, fontSize: 130, lineHeight: 0.92,
          letterSpacing: '-0.045em', margin: 0, color: V1.paper,
          fontVariationSettings: '"opsz" 144',
        }}>
          Empieza<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400, color: V1.accent }}>en una idea.</span><br />
          <span style={{ opacity: 0.5 }}>— Termina donde la idea pida.</span>
        </h1>

        {/* Process strip — the 360° in a single line */}
        <div style={{
          marginTop: 36, padding: '18px 0', borderTop: `1px solid ${V1.paper}20`,
          borderBottom: `1px solid ${V1.paper}20`,
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16,
          fontFamily: V1.mono, fontSize: 11, letterSpacing: '0.08em',
        }}>
          {[
            ['CONCEPTO', '01'],
            ['GUION', '02'],
            ['PRODUCCIÓN', '03'],
            ['POST', '04'],
            ['DISTRIBUCIÓN', '05'],
          ].map(([step, n], i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: V1.accent }}>{n}</span>
              <span style={{ color: V1.paper }}>{step}</span>
              {i < 4 && <span style={{ marginLeft: 'auto', color: V1.muted, opacity: 0.5 }}>—→</span>}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
          marginTop: 48, paddingTop: 28, borderTop: `1px solid ${V1.paper}20`,
        }}>
          <p style={{ fontSize: 15, lineHeight: 1.5, margin: 0, maxWidth: 360, color: V1.paper + 'cc' }}>
              Doppel es una agencia creativa. Pensamos, escribimos y dirigimos.
              Luego materializamos: en pantalla con <b style={{ color: V1.paper }}>Media</b>, o
              en cabina con <b style={{ color: V1.paper }}>Studio</b>. El formato
              llega después de la idea, nunca antes.
          </p>
          <div>
            <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.15em', color: V1.muted, marginBottom: 6 }}>
              DESDE
            </div>
            <div style={{ fontFamily: V1.display, fontSize: 32, fontWeight: 300 }}>2014</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.15em', color: V1.muted, marginBottom: 6 }}>
              PROYECTOS
            </div>
            <div style={{ fontFamily: V1.display, fontSize: 32, fontWeight: 300 }}>+180</div>
          </div>
        </div>
      </section>

      {/* Reel / featured work */}
      <section style={{ padding: '40px 40px 20px' }}>
        <VideoTile
          bg="#1a1a1a" fg={V1.paper} aspect="21/9" corner="REEL · 2025 / 01:48"
          style={{ width: '100%' }}
        />
      </section>

      {/* Work grid */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 28,
        }}>
          <h2 style={{
            fontFamily: V1.display, fontWeight: 300, fontSize: 56,
            letterSpacing: '-0.03em', margin: 0,
          }}>
            Trabajos <span style={{ fontStyle: 'italic', color: V1.muted }}>recientes</span>
          </h2>
          <a style={{ fontSize: 12, fontFamily: V1.mono, color: V1.muted, letterSpacing: '0.1em' }}>
            VER TODOS →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {PROJECTS.slice(0, 4).map((p, i) => (
            <div key={i}>
              <VideoTile bg={['#2a2218', '#1b2330', '#28201f', '#1f2821'][i]} fg={V1.paper} />
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginTop: 14,
              }}>
                <div>
                  <div style={{ fontFamily: V1.display, fontSize: 22, fontWeight: 400 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: V1.muted, fontFamily: V1.mono, letterSpacing: '0.08em', marginTop: 4 }}>
                    {p.client.toUpperCase()} · {p.type.toUpperCase()}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: V1.muted, fontFamily: V1.mono }}>{p.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doppel Studio section — was Pod Factory. Owns the cream + ray DNA. */}
      <section style={{ background: V1.paper, color: V1.ink, padding: '70px 40px', position: 'relative' }}>
        {/* Studio color bars — inherited Pod Factory visual DNA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 220, marginBottom: 26 }}>
          {['#1F3FA3', '#D92E2E', '#EF6A1F', '#F4B81C'].map(c => (
            <div key={c} style={{ height: 7, background: c }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{
              fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.2em',
              color: V1.ink, opacity: 0.55, marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: V1.ink, opacity: 0.4 }} />
              SECCIÓN 002 · DOPPEL STUDIO
            </div>
            <h2 style={{
              fontFamily: V1.sans, fontWeight: 800, fontSize: 96, lineHeight: 0.92,
              letterSpacing: '-0.035em', margin: 0,
            }}>
              doppel<br />studio<span style={{ color: V1.accent }}>.</span>
            </h2>
            <div style={{
              fontSize: 12, fontFamily: V1.mono, letterSpacing: '0.15em',
              color: V1.ink + '88', marginTop: 14,
            }}>
              ESPACIO FÍSICO · PROVIDENCIA · SANTIAGO
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 440, marginTop: 24, color: '#2a2a2a' }}>
              Nuestro estudio para producir podcast y vodcast. Cabina premium con
              setup multicámara, cabina móvil para grabar en locación, y un equipo que
              te acompaña desde la idea hasta el capítulo 100.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button style={{
                background: V1.ink, color: V1.paper, border: 'none', padding: '14px 22px',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: V1.sans,
              }}>RESERVAR ESTUDIO</button>
              <button style={{
                background: 'transparent', color: V1.ink, border: `1px solid ${V1.ink}40`,
                padding: '14px 22px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
                cursor: 'pointer', fontFamily: V1.sans,
              }}>VER PRODUCCIONES</button>
            </div>
          </div>

          {/* Mini podcast list */}
          <div style={{ borderTop: `1px solid ${V1.ink}20`, paddingTop: 4 }}>
            <div style={{
              fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.15em',
              color: V1.ink + '88', padding: '12px 0 6px',
            }}>
              ÚLTIMAS PRODUCCIONES
            </div>
            {PODCASTS.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 0', borderBottom: `1px solid ${V1.ink}15`,
              }}>
                <div style={{
                  width: 42, height: 42, background: ['#1F3FA3', '#D92E2E', '#EF6A1F', '#F4B81C'][i],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg viewBox="0 0 20 20" width="16" height="16"><path d="M7 5 L15 10 L7 15 Z" fill="#fff" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: V1.display, fontSize: 18, fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: V1.ink + '88', fontFamily: V1.mono, letterSpacing: '0.06em', marginTop: 2 }}>
                    {p.host.toUpperCase()} · {p.ep}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: V1.ink + '66', fontFamily: V1.mono }}>42:18</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services strip — the 360° in detail */}
      <section style={{ padding: '80px 40px 40px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.2em', color: V1.muted }}>
            003 / CÓMO TRABAJAMOS
          </div>
          <div style={{ fontSize: 11, fontFamily: V1.mono, color: V1.muted, fontStyle: 'italic' }}>
            ( de la idea a la entrega )
          </div>
        </div>
        <h2 style={{
          fontFamily: V1.display, fontWeight: 300, fontSize: 64,
          letterSpacing: '-0.03em', margin: '0 0 36px', maxWidth: 900, lineHeight: 1.02,
        }}>
          Una agencia creativa <span style={{ fontStyle: 'italic', color: V1.muted }}>de extremo a extremo.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderTop: `1px solid ${V1.paper}25` }}>
          {[
            ['01', 'Concepto & estrategia', 'Pensamos la idea antes de filmarla. Brief, insights, dirección creativa.'],
            ['02', 'Guion & arte', 'Escribimos el guión, diseñamos arte, planificamos producción.'],
            ['03', 'Producción & rodaje', 'Spots, brand films, documentales. En set, locación o studio.'],
            ['04', 'Post & distribución', 'Edición, color, sonido, masterizado. Te dejamos listo para publicar.'],
          ].map(([n, t, d], i) => (
            <div key={n} style={{
              padding: '28px 20px 28px 0',
              borderRight: i < 3 ? `1px solid ${V1.paper}15` : 'none',
              paddingLeft: i > 0 ? 20 : 0,
            }}>
              <div style={{ fontFamily: V1.mono, fontSize: 11, color: V1.accent, marginBottom: 18 }}>{n}</div>
              <div style={{ fontFamily: V1.display, fontSize: 26, fontWeight: 400, marginBottom: 8, lineHeight: 1.1 }}>{t}</div>
              <div style={{ fontSize: 13, color: V1.muted, lineHeight: 1.45 }}>{d}</div>
            </div>
          ))}
        </div>

        {/* Where it materializes — the two houses */}
        <div style={{
          marginTop: 56, paddingTop: 32, borderTop: `1px solid ${V1.paper}20`,
          display: 'grid', gridTemplateColumns: '0.6fr 1fr 1fr', gap: 0,
        }}>
          <div style={{ paddingRight: 32 }}>
            <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.2em', color: V1.muted, marginBottom: 14 }}>
              DÓNDE ATERRIZA
            </div>
            <h3 style={{ fontFamily: V1.display, fontWeight: 300, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>
              Dos casas para <span style={{ fontStyle: 'italic', color: V1.accent }}>materializar</span> la idea.
            </h3>
          </div>
          <div style={{ padding: '0 28px', borderLeft: `1px solid ${V1.paper}20` }}>
            <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.2em', color: V1.accent, marginBottom: 10 }}>
              ░ MEDIA
            </div>
            <div style={{ fontFamily: V1.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>
              Producción audiovisual
            </div>
            <div style={{ fontSize: 13, color: V1.muted, lineHeight: 1.5 }}>
              Brand films, comerciales, documentales, contenido propio. Aquí se vuelve video.
            </div>
            <a style={{ display: 'inline-block', marginTop: 14, fontSize: 11, fontFamily: V1.mono, color: V1.paper, letterSpacing: '0.1em' }}>
              VER MEDIA →
            </a>
          </div>
          <div style={{ padding: '0 28px', borderLeft: `1px solid ${V1.paper}20` }}>
            <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.2em', color: V1.podAccent, marginBottom: 10 }}>
              ░ STUDIO
            </div>
            <div style={{ fontFamily: V1.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>
              Podcast & vodcast
            </div>
            <div style={{ fontSize: 13, color: V1.muted, lineHeight: 1.5 }}>
              Cabina premium en Providencia + cabina móvil. Aquí se vuelve audio (y video).
            </div>
            <a style={{ display: 'inline-block', marginTop: 14, fontSize: 11, fontFamily: V1.mono, color: V1.paper, letterSpacing: '0.1em' }}>
              VER STUDIO →
            </a>
          </div>
        </div>
      </section>

      {/* Clients marquee */}
      <section style={{ padding: '40px 40px 60px', borderTop: `1px solid ${V1.paper}15`, borderBottom: `1px solid ${V1.paper}15` }}>
        <div style={{ fontSize: 10, fontFamily: V1.mono, letterSpacing: '0.2em', color: V1.muted, marginBottom: 24 }}>
          CONFIANZA / QUIENES NOS ELIGEN
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 24, alignItems: 'center' }}>
          {CLIENTS.map(c => (
            <div key={c} style={{
              fontFamily: V1.display, fontWeight: 300, fontSize: 20, letterSpacing: '-0.02em',
              color: V1.muted, textAlign: 'center',
            }}>{c}</div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '50px 40px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <h3 style={{
            fontFamily: V1.display, fontWeight: 300, fontSize: 64,
            margin: 0, lineHeight: 1, letterSpacing: '-0.03em', maxWidth: 600,
          }}>
            ¿Una idea <span style={{ fontStyle: 'italic', color: V1.accent }}>rondando</span>?<br />
            Escríbenos.
          </h3>
          <div style={{ textAlign: 'right', fontFamily: V1.mono, fontSize: 12, color: V1.muted, lineHeight: 1.8 }}>
            HOLA@DOPPEL.CL<br />
            +56 2 2345 6789<br />
            SANTIAGO — CHILE
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 24, borderTop: `1px solid ${V1.paper}20`,
          fontSize: 11, fontFamily: V1.mono, color: V1.muted, letterSpacing: '0.08em',
        }}>
          <span>© DOPPEL SPA · 2014—2026 · DOPPEL MEDIA + DOPPEL STUDIO</span>
          <span>IG · VIMEO · LINKEDIN · SPOTIFY</span>
        </div>
      </footer>
    </div>
  );
}

window.V1Home = V1Home;
