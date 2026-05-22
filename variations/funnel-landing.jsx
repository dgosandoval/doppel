// Funnel Landing — single page optimized for WhatsApp conversion
// Phone: +56 9 2797 0014 → wa.me/56927970014
// Each CTA pre-fills a context-tagged message so source is trackable in WA.

const FL = {
  bg: '#0E0E0E',
  paper: '#F4EFE6',
  ink: '#141414',
  muted: '#8B8883',
  mutedDim: '#5a5854',
  accent: '#FF6633',
  podAccent: '#F4B81C',
  whatsapp: '#25D366',   // Official WhatsApp green
  cream: '#F4EFE6',
  display: "'Fraunces', serif",
  sans: "'Archivo', sans-serif",
  mono: "'Space Mono', monospace",
};

const WA_PHONE = '56927970014';

function waLink(context) {
  const msg = encodeURIComponent(`Hola Doppel, ${context}`);
  return `https://wa.me/${WA_PHONE}?text=${msg}`;
}

// ── Primitives ─────────────────────────────────────────────────

function WhatsAppIcon({ size = 16, color = '#fff' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function WAButton({ context, label = 'Hablemos', size = 'md', variant = 'cream', style = {} }) {
  const sizes = {
    sm: { pad: '10px 18px', fs: 12, ic: 13 },
    md: { pad: '14px 22px', fs: 13, ic: 14 },
    lg: { pad: '18px 30px', fs: 14, ic: 16 },
    xl: { pad: '20px 36px', fs: 16, ic: 18 },
  }[size];
  const styles = variant === 'cream'
    ? { background: FL.cream, color: FL.ink, border: 'none' }
    : variant === 'ink'
    ? { background: FL.ink, color: FL.cream, border: 'none' }
    : variant === 'green'
    ? { background: FL.whatsapp, color: '#fff', border: 'none' }
    : { background: 'transparent', color: FL.paper, border: `1px solid ${FL.paper}40` };
  const iconColor = variant === 'cream' ? FL.ink : variant === 'ink' ? FL.cream : variant === 'green' ? '#fff' : FL.paper;
  return (
    <a
      href={waLink(context)}
      target="_blank"
      rel="noopener"
      style={{
        ...styles,
        padding: sizes.pad, fontSize: sizes.fs, fontWeight: 600,
        letterSpacing: '0.02em', cursor: 'pointer', fontFamily: FL.sans,
        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
        gap: 12, lineHeight: 1, borderRadius: 999, ...style,
      }}
    >
      {label}
      <span style={{ opacity: 0.55, display: 'inline-flex', alignItems: 'center' }}>
        <WhatsAppIcon size={sizes.ic} color={iconColor} />
      </span>
    </a>
  );
}

// ── Landing ────────────────────────────────────────────────────

function FunnelLanding() {
  return (
    <div style={{ background: FL.bg, color: FL.paper, fontFamily: FL.sans, minHeight: '100vh' }}>
      <SiteChrome url="doppel.cl" bg="#1a1a1a" fg={FL.paper} />

      {/* ── STICKY HEADER ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: `1px solid ${FL.paper}15`,
        position: 'sticky', top: 0, background: FL.bg, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="assets/doppel-logo.png" alt="Doppel" style={{ height: 24, display: 'block', filter: 'invert(94%) sepia(8%) saturate(120%) hue-rotate(347deg) brightness(98%) contrast(94%)' }} />
          <span style={{
            fontFamily: FL.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em',
            color: FL.muted, paddingLeft: 12, borderLeft: `1px solid ${FL.paper}25`,
            lineHeight: 1.3,
          }}>AGENCIA<br />CREATIVA</span>
        </div>
        <nav style={{ display: 'flex', gap: 26, fontSize: 13, color: FL.paper + 'cc' }}>
          {[
            ['Nosotros', '#cómo-trabajamos'],
            ['Portafolio', '#trabajos'],
            ['Pod Factory', '#pod-factory'],
            ['Por qué Doppel', '#por-qué-doppel'],
          ].map(([l, h]) => (
            <a key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>
          ))}
        </nav>
        <WAButton context="quiero conversar sobre un proyecto." label="Hablemos" size="sm" />
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: '70px 40px 50px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.1em' }}>
            ( AGENCIA CREATIVA 360° · DESDE 2012 )
          </div>
        </div>

        {/* Two-column hero: copy left, image right */}
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '0.8fr 2fr', gap: 40, alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontFamily: FL.display, fontWeight: 300, fontSize: 'clamp(28px,4.5vw,72px)', lineHeight: 0.96,
              letterSpacing: '-0.04em', margin: 0, color: FL.paper,
            }}>
              Tu idea<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: FL.accent }}>merece producirse bien.</span>
            </h1>

            <p style={{
              fontSize: 17, lineHeight: 1.5, maxWidth: 540, marginTop: 28,
              color: FL.paper + 'cc', fontWeight: 400,
            }}>
              Somos Doppel. Una agencia creativa que piensa, escribe y dirige.
              Spots, brand films, documentales, podcasts y vodcasts.
            </p>

            {/* Primary CTA cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
              <WAButton context="vengo desde la web, hablemos." label="Hablemos" size="lg" />
              <a href="#trabajos" style={{
                fontSize: 12, fontFamily: FL.mono, color: FL.paper, letterSpacing: '0.1em',
                textDecoration: 'none', borderBottom: `1px solid ${FL.paper}40`, paddingBottom: 4,
              }}>
                VER REEL ↓
              </a>
            </div>
          </div>

          {/* Powerful representative image — now a carousel */}
          <ImageCarousel images={CAROUSEL_IMAGES} autoplay={true} autoplayDelay={6000} />
        </div>

        {/* Trust stats */}
        <div className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          marginTop: 70, paddingTop: 28, borderTop: `1px solid ${FL.paper}20`,
        }}>
          {[
            ['15', 'años de experiencia'],
            ['+500', 'proyectos producidos'],
            ['+40', 'marcas que confían'],
          ].map(([n, l], i) => (
            <div key={i} style={{ paddingRight: 24, borderRight: i < 2 ? `1px solid ${FL.paper}15` : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
              <div style={{ fontFamily: FL.display, fontSize: 52, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, color: FL.muted, marginTop: 6, fontFamily: FL.mono, letterSpacing: '0.06em' }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── REEL ── */}
      <section id="trabajos" style={{ padding: '20px 40px 60px' }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', background: '#000', overflow: 'hidden' }}>
          <iframe
            src="https://player.vimeo.com/video/589999111?title=0&byline=0&portrait=0&dnt=1"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Doppel Reel"
          />
        </div>
      </section>

      {/* ── MID-FUNNEL CTA ── */}
      <section className="mid-cta" style={{
        padding: '40px 40px', background: FL.paper, color: FL.ink,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32,
      }}>
        <div style={{ fontFamily: FL.display, fontSize: 40, fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1.05, maxWidth: 700 }}>
          ¿Quieres pensar algo juntos? <span style={{ fontStyle: 'italic', color: FL.accent }}>Hagámoslo.</span>
        </div>
        <WAButton context="quiero pensar un proyecto con ustedes." label="Hablemos" size="lg" />
      </section>

      {/* ── CLIENT STRIP ── */}
      <section style={{ padding: '20px 40px 50px', borderTop: `1px solid ${FL.paper}15`, borderBottom: `1px solid ${FL.paper}15` }}>
        <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 22 }}>
          MARCAS QUE NOS HAN ELEGIDO
        </div>
        <div className="clients-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 24, alignItems: 'center' }}>
          {CLIENTS.map(c => (
            <div key={c} style={{
              fontFamily: FL.display, fontWeight: 300, fontSize: 20, letterSpacing: '-0.02em',
              color: FL.muted, textAlign: 'center',
            }}>{c}</div>
          ))}
        </div>
      </section>

      {/* ── HOW WE WORK (360°) ── */}
      <section id="cómo-trabajamos" style={{ padding: '80px 40px 60px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12,
        }}>
          <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted }}>
            CÓMO TRABAJAMOS / 360°
          </div>
          <div style={{ fontSize: 11, fontFamily: FL.mono, color: FL.muted, fontStyle: 'italic' }}>
            ( de la idea a la entrega )
          </div>
        </div>
        <h2 style={{
          fontFamily: FL.display, fontWeight: 300, fontSize: 64,
          letterSpacing: '-0.03em', margin: '0 0 40px', maxWidth: 900, lineHeight: 1.02,
        }}>
          Pensamos antes <span style={{ fontStyle: 'italic', color: FL.accent }}>de filmar.</span>
        </h2>

        <div className="reasons-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 0, borderTop: `1px solid ${FL.paper}25` }}>
          {[
            ['01', 'Concepto', 'Conversamos contigo y proponemos la idea que mueve el proyecto.'],
            ['02', 'Guion & arte', 'Escribimos, dirigimos arte, planificamos producción.'],
            ['03', 'Rodaje', 'Equipo propio, set o locación. Cámara, sonido, dirección.'],
            ['04', 'Post', 'Edición, color, sonido, masterizado.'],
            ['05', 'Distribución', 'Te dejamos listo para publicar en cualquier canal.'],
          ].map(([n, t, d], i) => (
            <div key={n} style={{
              padding: '24px 16px 24px 0',
              borderRight: i < 4 ? `1px solid ${FL.paper}15` : 'none',
              paddingLeft: i > 0 ? 16 : 0,
            }}>
              <div style={{ fontFamily: FL.mono, fontSize: 11, color: FL.accent, marginBottom: 16 }}>{n}</div>
              <div style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 400, marginBottom: 8, lineHeight: 1.1 }}>{t}</div>
              <div style={{ fontSize: 12, color: FL.muted, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>

        {/* Where it materializes */}
        <div className="where-grid" style={{
          marginTop: 48, padding: '36px 0 0', borderTop: `1px solid ${FL.paper}20`,
          display: 'grid', gridTemplateColumns: '0.7fr 1fr 1fr', gap: 24,
        }}>
          <div style={{ paddingRight: 24 }}>
            <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 14 }}>
              DÓNDE ATERRIZA
            </div>
            <h3 style={{ fontFamily: FL.display, fontWeight: 300, fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>
              Dos casas para <span style={{ fontStyle: 'italic', color: FL.accent }}>materializar</span> la idea.
            </h3>
          </div>
          <div style={{ paddingLeft: 24, borderLeft: `1px solid ${FL.paper}20` }}>
            <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.accent, marginBottom: 10 }}>░ MEDIA</div>
            <div style={{ fontFamily: FL.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Producción audiovisual</div>
            <div style={{ fontSize: 13, color: FL.muted, lineHeight: 1.5 }}>
              Brand films, comerciales, documentales y contenido propio.
            </div>
          </div>
          <div style={{ paddingLeft: 24, borderLeft: `1px solid ${FL.paper}20` }}>
            <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.podAccent, marginBottom: 10 }}>░ POD FACTORY · BY DOPPEL</div>
            <div style={{ fontFamily: FL.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Premium Podcast Studio</div>
            <div style={{ fontSize: 13, color: FL.muted, lineHeight: 1.5 }}>
              Estudio premium en Vitacura + estudio móvil. Multicámara 4K.
            </div>
          </div>
        </div>
      </section>

      {/* ── WORK GRID ── */}
      <section style={{ padding: '70px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h2 style={{ fontFamily: FL.display, fontWeight: 300, fontSize: 56, letterSpacing: '-0.03em', margin: 0 }}>
            Trabajos <span style={{ fontStyle: 'italic', color: FL.muted }}>recientes</span>
          </h2>
          <a href="#" style={{ fontSize: 12, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.1em' }}>VER TODOS →</a>
        </div>
        <div className="work-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {PROJECTS.slice(0, 4).map((p, i) => (
            <div key={i}>
              <VideoTile bg={['#2a2218', '#1b2330', '#28201f', '#1f2821'][i]} fg={FL.paper} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                <div>
                  <div style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 400 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: FL.muted, fontFamily: FL.mono, letterSpacing: '0.08em', marginTop: 4 }}>
                    {p.client.toUpperCase()} · {p.type.toUpperCase()}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: FL.muted, fontFamily: FL.mono }}>{p.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POD FACTORY (STUDIO) SECTION ── */}
      <section id="pod-factory" style={{ background: FL.paper, color: FL.ink, padding: '70px 40px' }}>
        {/* Pod Factory header lockup */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, marginBottom: 40, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <img
              src="assets/podfactory-logo.png"
              alt="Pod Factory"
              style={{ display: 'block', height: 110, width: 'auto' }}
            />
            <div style={{
              paddingLeft: 22, borderLeft: `1.5px solid ${FL.ink}25`,
              fontFamily: FL.mono, fontSize: 11, letterSpacing: '0.2em', lineHeight: 1.7,
            }}>
              <div style={{ color: FL.ink + '99' }}>POD FACTORY</div>
              <div style={{ color: FL.ink, fontWeight: 600 }}>BY DOPPEL</div>
              <div style={{ marginTop: 6, color: FL.ink + '99' }}>EST. 2019 · VITACURA, SCL</div>
            </div>
          </div>
          <div style={{
            fontFamily: FL.display, fontStyle: 'italic', fontWeight: 400, fontSize: 22,
            color: FL.ink + 'aa', letterSpacing: '-0.01em',
          }}>
            Premium Podcast Studio
          </div>
        </div>

        <div className="pod-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: FL.sans, fontWeight: 800, fontSize: 76, lineHeight: 0.94, letterSpacing: '-0.035em', margin: 0 }}>
              ¿Quieres lanzar<br />tu podcast?
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 480, marginTop: 24, color: '#2a2a2a' }}>
              Pod Factory es el estudio premium de Doppel para podcast y vodcast,
              ubicado en Vitacura. Multicámara 4K, masterización incluida y un equipo
              que te acompaña desde la idea al capítulo 100.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
              <WAButton context="quiero reservar Pod Factory para mi podcast." label="Reservar estudio" size="lg" variant="ink" />
            </div>
          </div>

          {/* Mini features grid */}
          <div className="mini-features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['4 cámaras 4K', '#1F3FA3'],
              ['+300 episodios producidos', '#D92E2E'],
              ['24h entrega masterizada', '#EF6A1F'],
              ['Estudio móvil + locación', '#F4B81C'],
            ].map(([t, c], i) => (
              <div key={i} style={{ border: `1.5px solid ${FL.ink}`, background: FL.paper, padding: 18, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ height: 6, background: c, width: 40 }} />
                <div style={{ fontFamily: FL.sans, fontWeight: 700, fontSize: 18, letterSpacing: '-0.015em' }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DOPPEL ── */}
      <section id="por-qué-doppel" style={{ padding: '80px 40px' }}>
        <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 14 }}>
          POR QUÉ DOPPEL
        </div>
        <h2 style={{
          fontFamily: FL.display, fontWeight: 300, fontSize: 56, letterSpacing: '-0.03em',
          margin: '0 0 40px', maxWidth: 900, lineHeight: 1.02,
        }}>
          Cuatro razones <span style={{ fontStyle: 'italic', color: FL.accent }}>concretas.</span>
        </h2>
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            ['Pensamos, no sólo filmamos', 'Creamos el concepto o lo afilamos contigo. Antes de prender cámaras hay una idea sólida y un punto de vista.'],
            ['Equipo propio y estudio físico', 'Cámaras, sonido, dirección, edición y Pod Factory — nuestro estudio de podcast en Vitacura. Todo bajo un mismo techo.'],
            ['15 años de track record', '+500 proyectos para Walmart, Ford, LATAM, Entel, Enel, Coca-Cola Andina y más. Sabemos cómo entregar a tiempo.'],
            ['Respondemos rápido', 'Menos de 1 hora desde tu mensaje en horario hábil. Sin formularios eternos ni cadenas de correos.'],
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: '24px 0', borderTop: `1px solid ${FL.paper}20`, display: 'flex', gap: 20 }}>
              <div style={{ fontFamily: FL.mono, fontSize: 14, color: FL.accent, minWidth: 30 }}>0{i + 1}</div>
              <div>
                <div style={{ fontFamily: FL.display, fontSize: 30, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{t}</div>
                <div style={{ fontSize: 14, color: FL.muted, lineHeight: 1.5, marginTop: 8, maxWidth: 480 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '40px 40px 70px', borderTop: `1px solid ${FL.paper}15` }}>
        <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 32 }}>
          LO QUE DICEN
        </div>
        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            ['Doppel entendió la marca antes que nosotros mismos. La pieza final superó el brief.', 'M. González', 'Brand Manager · Walmart Chile'],
            ['El studio de podcast es de otro nivel. Llegamos, grabamos, salimos con el episodio listo.', 'F. Vera', 'Conductora · Rutas Paralelas'],
          ].map(([q, n, r], i) => (
            <div key={i} style={{ padding: '24px 28px', border: `1px solid ${FL.paper}20` }}>
              <div style={{ fontFamily: FL.display, fontSize: 24, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.3, letterSpacing: '-0.01em', color: FL.paper }}>
                "{q}"
              </div>
              <div style={{ marginTop: 18, fontSize: 12, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.06em' }}>
                <b style={{ color: FL.paper }}>{n}</b> · {r}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '40px 40px 70px' }}>
        <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 32 }}>
          PREGUNTAS FRECUENTES
        </div>
        <div style={{ borderTop: `1px solid ${FL.paper}20` }}>
          {[
            ['¿Atienden proyectos chicos o solo grandes marcas?', 'Atendemos ambos. El equipo se arma según el alcance — desde un capítulo de podcast hasta una campaña full para una marca grande.'],
            ['¿Cuánto demora una producción?', 'Depende del formato. Un brand film promedio toma 4–8 semanas desde el brief. Un podcast lo grabas y editamos en 24–72h.'],
            ['¿Trabajan fuera de Santiago?', 'Sí. Producimos en todo Chile y tenemos estudio móvil para grabar podcasts en cualquier locación.'],
            ['¿Cómo cobran?', 'Cotizamos por proyecto con todo incluido. Pod Factory tiene tarifa por hora. Cuéntanos y te respondemos rápido.'],
          ].map(([q, a], i) => (
            <details key={i} style={{ borderBottom: `1px solid ${FL.paper}20`, padding: '18px 0' }}>
              <summary style={{
                fontFamily: FL.display, fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em',
                cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {q}
                <span style={{ color: FL.accent, fontSize: 24, lineHeight: 1 }}>+</span>
              </summary>
              <p style={{ fontSize: 14, color: FL.muted, lineHeight: 1.55, marginTop: 12, marginBottom: 4, maxWidth: 720 }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '90px 40px', background: FL.accent, color: FL.ink }}>
        <div style={{ fontSize: 11, fontFamily: FL.mono, letterSpacing: '0.2em', marginBottom: 18 }}>
          ⏁ CONVERSEMOS
        </div>
        <h2 style={{
          fontFamily: FL.display, fontWeight: 300, fontSize: 112, lineHeight: 0.88,
          letterSpacing: '-0.04em', margin: 0, color: FL.ink,
        }}>
          Pensemos<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>algo bueno.</span>
        </h2>
        <p style={{ fontSize: 19, lineHeight: 1.4, maxWidth: 580, marginTop: 28, color: FL.ink }}>
          Respondemos en menos de 1 hora en horario hábil. Sin formularios, sin esperas:
          un humano del equipo que va a producir tu proyecto.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
          <WAButton context="vengo desde la web, conversemos." label="Hablemos" size="xl" variant="ink" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-grid" style={{ padding: '40px 40px 28px', background: FL.bg }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 24, borderBottom: `1px solid ${FL.paper}20`,
        }}>
          <div>
            <img src="assets/doppel-logo.png" alt="Doppel" style={{ height: 30, display: 'block', filter: 'invert(94%) sepia(8%) saturate(120%) hue-rotate(347deg) brightness(98%) contrast(94%)' }} />
            <div style={{ fontFamily: FL.mono, fontSize: 11, color: FL.muted, marginTop: 14, letterSpacing: '0.1em' }}>
              AGENCIA CREATIVA 360° · DOPPEL + POD FACTORY · SANTIAGO
            </div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: FL.mono, fontSize: 12, color: FL.muted, lineHeight: 1.8 }}>
            HOLA@DOPPEL.CL<br />
            +56 9 2797 0014<br />
            AV. VITACURA, SANTIAGO
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 22,
          fontSize: 11, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.08em',
        }}>
          <span>© DOPPEL SPA · 2014—2026</span>
          <span>IG · VIMEO · LINKEDIN · SPOTIFY</span>
        </div>
      </footer>

      {/* ── STICKY FLOATING WHATSAPP BUTTON ── */}
      <div className="whatsapp-float" style={{
        position: 'absolute', bottom: 24, right: 24, zIndex: 20,
      }}>
        <a
          href={waLink('vengo desde la web, conversemos.')}
          target="_blank" rel="noopener"
          style={{
            background: FL.cream, color: FL.ink, borderRadius: 999,
            padding: '12px 18px 12px 16px', display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)',
            textDecoration: 'none', cursor: 'pointer',
            fontFamily: FL.sans, fontSize: 13, fontWeight: 600,
          }}
        >
          Hablemos
          <span style={{ opacity: 0.55, display: 'inline-flex' }}>
            <WhatsAppIcon size={14} color={FL.ink} />
          </span>
        </a>
      </div>
    </div>
  );
}

window.FunnelLanding = FunnelLanding;
window.WAButton = WAButton;
window.waLink = waLink;
