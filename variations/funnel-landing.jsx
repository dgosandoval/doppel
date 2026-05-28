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

// ── Lazy Vimeo reel: only loads/plays when section enters viewport ──

function LazyVimeoReel({ id = '589999111', title = 'Doppel Reel' }) {
  const [active, setActive] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', aspectRatio: '16/9', width: '100%', background: '#000', overflow: 'hidden' }}>
      {active && (
        <iframe
          src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&dnt=1&autoplay=1&muted=1&loop=1&playsinline=1`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  );
}

// ── Reveal: generic fade-up wrapper triggered by IntersectionObserver ──

function Reveal({ children, delay = 0, distance = 22, duration = 750, threshold = 0.2, style = {}, as: Tag = 'div' }) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: '-60px 0px -60px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return (
    <Tag
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

// ── Animated stat: counts up + fades in once it enters viewport ─────

function AnimatedStat({ value, label, delay = 0, isLast = false }) {
  const [count, setCount] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  const match = String(value).match(/^([+\-]?)(\d+)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseInt(match[2], 10) : 0;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (!visible) return;
    const duration = 1400;
    let raf;
    let startTs = null;
    const tick = (now) => {
      if (startTs === null) startTs = now + delay;
      const elapsed = Math.max(0, now - startTs);
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, delay]);

  return (
    <div
      ref={ref}
      style={{
        paddingRight: 24,
        borderRight: !isLast ? `1px solid ${FL.paper}15` : 'none',
        paddingLeft: delay > 0 ? 24 : 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <div style={{
        fontFamily: FL.display, fontSize: 52, fontWeight: 300,
        letterSpacing: '-0.03em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {prefix}{count}
      </div>
      <div style={{
        fontSize: 11, color: FL.muted, marginTop: 6,
        fontFamily: FL.mono, letterSpacing: '0.06em',
      }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

// ── Client strip section with staggered fade-up entrance ─────────

function ClientStrip() {
  const [triggered, setTriggered] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: '-80px 0px -80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const numRows = 3;
  const per = Math.ceil(CLIENT_LOGOS.length / numRows);
  const rows = Array.from({ length: numRows }, (_, r) =>
    CLIENT_LOGOS.slice(r * per, (r + 1) * per)
  ).filter(r => r.length > 0);

  // Header fades in first, then logos stagger after
  const headerDelay = 0;
  const logoBaseDelay = 300;
  const logoStep = 110;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '48px 40px 56px',
        background: '#ffffff',
        color: FL.ink,
        borderTop: `1px solid ${FL.ink}10`,
      }}
    >
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 28,
          opacity: triggered ? 1 : 0,
          transform: triggered ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity 0.6s ease ${headerDelay}ms, transform 0.6s ease ${headerDelay}ms`,
        }}
      >
        <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.ink + 'aa' }}>
          MARCAS QUE NOS HAN ELEGIDO
        </div>
        <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.ink + '66' }}>
          {String(CLIENT_LOGOS.length).padStart(2, '0')} / SELECCIÓN
        </div>
      </div>
      <div className="clients-grid" style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderTop: ri > 0 ? `1px solid ${FL.ink}12` : 'none',
            }}
          >
            {row.map((c, i) => {
              const globalIdx = ri * per + i;
              const delay = logoBaseDelay + globalIdx * logoStep;
              return (
                <div
                  key={c.name}
                  style={{
                    flex: 1, maxWidth: 150,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: 80, padding: '0 14px',
                    borderRight: i < row.length - 1 ? `1px solid ${FL.ink}10` : 'none',
                    opacity: triggered ? 1 : 0,
                    transform: triggered ? 'translateY(0)' : 'translateY(18px)',
                    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
                  }}
                >
                  <ClientLogo client={c} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Client logo (real image if provided, polished wordmark fallback) ──

function ClientLogo({ client }) {
  const [hover, setHover] = React.useState(false);
  const scale = client.scale || 1;
  if (client.src) {
    const hoverScale = hover ? 1.04 : 1;
    return (
      <img
        src={client.src}
        alt={client.name}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          maxHeight: 40, maxWidth: '100%', objectFit: 'contain',
          filter: hover ? 'none' : 'grayscale(100%) contrast(1.05)',
          opacity: hover ? 1 : 0.75,
          transition: 'opacity 0.25s ease, filter 0.3s ease, transform 0.25s ease',
          transform: `scale(${scale * hoverScale})`,
          transformOrigin: 'center',
        }}
      />
    );
  }
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: FL.display, fontWeight: 400, fontSize: 22,
        letterSpacing: '-0.02em', fontStyle: 'italic',
        color: FL.ink, opacity: hover ? 1 : 0.6,
        whiteSpace: 'nowrap', transition: 'opacity 0.25s ease',
      }}
    >
      {client.name}
    </span>
  );
}

// ── Landing ────────────────────────────────────────────────────

function FunnelLanding() {
  return (
    <div style={{ background: FL.bg, color: FL.paper, fontFamily: FL.sans, minHeight: '100vh' }}>
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
            ['Por qué Doppel', '#por-qué-doppel'],
          ].map(([l, h]) => (
            <a key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="pod_factory/"
            style={{
              background: FL.podAccent, color: FL.ink, padding: '10px 16px',
              fontSize: 12, fontWeight: 700, fontFamily: FL.sans, letterSpacing: '0.04em',
              textDecoration: 'none', borderRadius: 999, display: 'inline-flex',
              alignItems: 'center', gap: 6, lineHeight: 1,
            }}
          >
            Pod Factory <span style={{ fontSize: 11, opacity: 0.8 }}>↗</span>
          </a>
          <WAButton context="quiero conversar sobre un proyecto." label="Hablemos" size="sm" />
        </div>
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
          ].map(([n, l], i, arr) => (
            <AnimatedStat key={i} value={n} label={l} delay={i * 180} isLast={i === arr.length - 1} />
          ))}
        </div>
      </section>

      {/* ── REEL ── */}
      <section id="trabajos" style={{ padding: '20px 40px 60px' }}>
        <LazyVimeoReel id="589999111" title="Doppel Reel" />
      </section>

      {/* ── MID-FUNNEL CTA ── */}
      <section className="mid-cta" style={{
        padding: '40px 40px', background: FL.paper, color: FL.ink,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32,
      }}>
        <Reveal style={{ fontFamily: FL.display, fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: 720 }}>
          <Reveal delay={0}   style={{ fontWeight: 300, color: FL.ink + 'aa' }}>Comunicación efectiva.</Reveal>
          <Reveal delay={150} style={{ fontWeight: 600, color: FL.ink }}>Mensajes que llegan.</Reveal>
          <Reveal delay={300} style={{ fontWeight: 300, fontStyle: 'italic', color: FL.accent }}>Ideas que perduran.</Reveal>
        </Reveal>
        <Reveal delay={500}><WAButton context="quiero pensar un proyecto con ustedes." label="Hablemos" size="lg" /></Reveal>
      </section>

      {/* ── CLIENT STRIP ── */}
      <ClientStrip />

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
        <Reveal as="h2" style={{
          fontFamily: FL.display, fontWeight: 300, fontSize: 64,
          letterSpacing: '-0.03em', margin: '0 0 40px', maxWidth: 900, lineHeight: 1.02,
        }}>
          Pensamos antes <span style={{ fontStyle: 'italic', color: FL.accent }}>de filmar.</span>
        </Reveal>

        <div className="reasons-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 0, borderTop: `1px solid ${FL.paper}25` }}>
          {[
            ['01', 'Concepto', 'Conversamos contigo y proponemos la idea que mueve el proyecto.'],
            ['02', 'Guion & arte', 'Escribimos, dirigimos arte, planificamos producción.'],
            ['03', 'Rodaje', 'Equipo propio, set o locación. Cámara, sonido, dirección.'],
            ['04', 'Post', 'Edición, color, sonido, masterizado.'],
            ['05', 'Distribución', 'Te dejamos listo para publicar en cualquier canal.'],
          ].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 120} style={{
              padding: '24px 16px 24px 0',
              borderRight: i < 4 ? `1px solid ${FL.paper}15` : 'none',
              paddingLeft: i > 0 ? 16 : 0,
            }}>
              <div style={{ fontFamily: FL.mono, fontSize: 11, color: FL.accent, marginBottom: 16 }}>{n}</div>
              <div style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 400, marginBottom: 8, lineHeight: 1.1 }}>{t}</div>
              <div style={{ fontSize: 12, color: FL.muted, lineHeight: 1.5 }}>{d}</div>
            </Reveal>
          ))}
        </div>

        {/* Where it materializes */}
        <div className="where-grid" style={{
          marginTop: 48, padding: '36px 0 0', borderTop: `1px solid ${FL.paper}20`,
          display: 'grid', gridTemplateColumns: '0.7fr 1fr 1fr', gap: 24,
        }}>
          <Reveal style={{ paddingRight: 24 }}>
            <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 14 }}>
              DÓNDE ATERRIZA
            </div>
            <h3 style={{ fontFamily: FL.display, fontWeight: 300, fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>
              Dos casas para <span style={{ fontStyle: 'italic', color: FL.accent }}>materializar</span> la idea.
            </h3>
          </Reveal>
          <Reveal delay={160} style={{ paddingLeft: 24, borderLeft: `1px solid ${FL.paper}20` }}>
            <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.accent, marginBottom: 10 }}>░ MEDIA</div>
            <div style={{ fontFamily: FL.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Producción audiovisual</div>
            <div style={{ fontSize: 13, color: FL.muted, lineHeight: 1.5 }}>
              Brand films, comerciales, documentales y contenido propio.
            </div>
          </Reveal>
          <Reveal delay={280} style={{ paddingLeft: 24, borderLeft: `1px solid ${FL.paper}20` }}>
            <div style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.podAccent, marginBottom: 10 }}>░ POD FACTORY · BY DOPPEL</div>
            <div style={{ fontFamily: FL.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Premium Podcast Studio</div>
            <div style={{ fontSize: 13, color: FL.muted, lineHeight: 1.5 }}>
              Estudio premium en Vitacura + estudio móvil. Multicámara 4K.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WORK GRID ── */}
      <section style={{ padding: '70px 40px' }}>
        <Reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h2 style={{ fontFamily: FL.display, fontWeight: 300, fontSize: 56, letterSpacing: '-0.03em', margin: 0 }}>
            Proyectos <span style={{ fontStyle: 'italic', color: FL.muted }}>destacados</span>
          </h2>
          <a href="#" style={{ fontSize: 12, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.1em' }}>VER TODOS →</a>
        </Reveal>
        <div className="work-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {PROJECTS.slice(0, 4).map((p, i) => (
            <Reveal key={p.vimeoId} delay={150 + i * 130}>
              <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', background: '#000', overflow: 'hidden' }}>
                <iframe
                  src={`https://player.vimeo.com/video/${p.vimeoId}?title=0&byline=0&portrait=0&dnt=1`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`${p.client} · ${p.title}`}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                <div>
                  <div style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 400 }}>{p.client} · {p.title}</div>
                  <div style={{ fontSize: 11, color: FL.muted, fontFamily: FL.mono, letterSpacing: '0.08em', marginTop: 4 }}>
                    {p.type.toUpperCase()}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: FL.muted, fontFamily: FL.mono }}>{p.year}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── POD FACTORY (STUDIO) SECTION ── */}
      <section id="pod-factory" style={{ background: FL.paper, color: FL.ink, padding: '70px 40px' }}>
        {/* Pod Factory header lockup */}
        <Reveal style={{
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
              <div style={{ marginTop: 6, color: FL.ink + '99' }}>EST. 2024 · EDUARDO MARQUINA 3937, VITACURA, SCL</div>
            </div>
          </div>
          <div style={{
            fontFamily: FL.display, fontStyle: 'italic', fontWeight: 400, fontSize: 22,
            color: FL.ink + 'aa', letterSpacing: '-0.01em',
          }}>
            Premium Podcast Studio
          </div>
        </Reveal>

        <div className="pod-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
          <Reveal delay={150}>
            <h2 style={{ fontFamily: FL.sans, fontWeight: 800, fontSize: 76, lineHeight: 0.94, letterSpacing: '-0.035em', margin: 0 }}>
              ¿Quieres lanzar<br />tu podcast?
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 480, marginTop: 24, color: '#2a2a2a' }}>
              Pod Factory es el estudio premium de Doppel para podcast y vodcast,
              ubicado en Vitacura. Multicámara 4K, masterización incluida y un equipo
              que te acompaña desde la idea al capítulo 100.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 28, alignItems: 'center', flexWrap: 'wrap' }}>
              <WAButton context="quiero reservar Pod Factory para mi podcast." label="Reservar estudio" size="lg" variant="ink" />
              <a href="pod_factory/" style={{
                fontSize: 13, fontFamily: FL.mono, color: FL.ink, letterSpacing: '0.08em',
                textDecoration: 'none', borderBottom: `1px solid ${FL.ink}`, paddingBottom: 4,
                fontWeight: 600,
              }}>
                CONOCER POD FACTORY →
              </a>
            </div>
          </Reveal>

          {/* Mini features grid */}
          <div className="mini-features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['4 cámaras 4K', '#1F3FA3'],
              ['+300 episodios producidos', '#D92E2E'],
              ['24h entrega masterizada', '#EF6A1F'],
              ['Estudio móvil + locación', '#F4B81C'],
            ].map(([t, c], i) => (
              <Reveal key={i} delay={300 + i * 110} style={{ border: `1.5px solid ${FL.ink}`, background: FL.paper, padding: 18, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ height: 6, background: c, width: 40 }} />
                <div style={{ fontFamily: FL.sans, fontWeight: 700, fontSize: 18, letterSpacing: '-0.015em' }}>{t}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DOPPEL ── */}
      <section id="por-qué-doppel" style={{ padding: '80px 40px' }}>
        <Reveal style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 14 }}>
          POR QUÉ DOPPEL
        </Reveal>
        <Reveal as="h2" delay={100} style={{
          fontFamily: FL.display, fontWeight: 300, fontSize: 56, letterSpacing: '-0.03em',
          margin: '0 0 40px', maxWidth: 900, lineHeight: 1.02,
        }}>
          Cuatro razones <span style={{ fontStyle: 'italic', color: FL.accent }}>concretas.</span>
        </Reveal>
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            ['Pensamos, no sólo filmamos', 'Creamos el concepto o lo afilamos contigo. Antes de prender cámaras hay una idea sólida y un punto de vista.'],
            ['Equipo propio y estudio físico', 'Cámaras, sonido, dirección, edición y Pod Factory — nuestro estudio de podcast en Vitacura. Todo bajo un mismo techo.'],
            ['15 años de track record', '+500 proyectos para Walmart, Ford, LATAM, Entel, Enel, Coca-Cola Andina y más. Sabemos cómo entregar a tiempo.'],
            ['Respondemos rápido', 'Sin formularios eternos ni cadenas de correos. Un humano del equipo te contesta directo.'],
          ].map(([t, d], i) => (
            <Reveal key={i} delay={250 + i * 140} style={{ padding: '24px 0', borderTop: `1px solid ${FL.paper}20`, display: 'flex', gap: 20 }}>
              <div style={{ fontFamily: FL.mono, fontSize: 14, color: FL.accent, minWidth: 30 }}>0{i + 1}</div>
              <div>
                <div style={{ fontFamily: FL.display, fontSize: 30, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{t}</div>
                <div style={{ fontSize: 14, color: FL.muted, lineHeight: 1.5, marginTop: 8, maxWidth: 480 }}>{d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '40px 40px 70px', borderTop: `1px solid ${FL.paper}15` }}>
        <Reveal style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 32 }}>
          LO QUE DICEN
        </Reveal>
        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            ['Doppel entendió la marca antes que nosotros mismos. La pieza final superó el brief.', 'M. González', 'Brand Manager · Walmart Chile'],
            ['El studio de podcast es de otro nivel. Llegamos, grabamos, salimos con el episodio listo.', 'F. Vera', 'Conductora · Rutas Paralelas'],
          ].map(([q, n, r], i) => (
            <Reveal key={i} delay={150 + i * 180} style={{ padding: '24px 28px', border: `1px solid ${FL.paper}20` }}>
              <div style={{ fontFamily: FL.display, fontSize: 24, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.3, letterSpacing: '-0.01em', color: FL.paper }}>
                "{q}"
              </div>
              <div style={{ marginTop: 18, fontSize: 12, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.06em' }}>
                <b style={{ color: FL.paper }}>{n}</b> · {r}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '40px 40px 70px' }}>
        <Reveal style={{ fontSize: 10, fontFamily: FL.mono, letterSpacing: '0.2em', color: FL.muted, marginBottom: 32 }}>
          PREGUNTAS FRECUENTES
        </Reveal>
        <div style={{ borderTop: `1px solid ${FL.paper}20` }}>
          {[
            ['¿Atienden proyectos chicos o solo grandes marcas?', 'Atendemos ambos. El equipo se arma según el alcance — desde un capítulo de podcast hasta una campaña full para una marca grande.'],
            ['¿Cuánto demora una producción?', 'Depende del formato. Un brand film promedio toma 4–8 semanas desde el brief. Un podcast lo grabas y editamos en 24–72h.'],
            ['¿Trabajan fuera de Santiago?', 'Sí. Producimos en todo Chile y tenemos estudio móvil para grabar podcasts en cualquier locación.'],
            ['¿Cómo cobran?', 'Cotizamos por proyecto con todo incluido. Pod Factory tiene tarifa por hora. Cuéntanos y te respondemos rápido.'],
          ].map(([q, a], i) => (
            <Reveal as="details" key={i} delay={150 + i * 100} style={{ borderBottom: `1px solid ${FL.paper}20`, padding: '18px 0' }}>
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '90px 40px', background: FL.accent, color: FL.ink }}>
        <Reveal style={{ fontSize: 11, fontFamily: FL.mono, letterSpacing: '0.2em', marginBottom: 18 }}>
          ⏁ CONVERSEMOS
        </Reveal>
        <Reveal as="h2" delay={120} style={{
          fontFamily: FL.display, fontWeight: 300, fontSize: 112, lineHeight: 0.88,
          letterSpacing: '-0.04em', margin: 0, color: FL.ink,
        }}>
          Pensemos<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>algo bueno.</span>
        </Reveal>
        <Reveal as="p" delay={280} style={{ fontSize: 19, lineHeight: 1.4, maxWidth: 580, marginTop: 28, color: FL.ink }}>
          Respondemos rápido en horario hábil. Sin formularios, sin esperas:
          un humano del equipo que va a producir tu proyecto.
        </Reveal>
        <Reveal delay={440} style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
          <WAButton context="vengo desde la web, conversemos." label="Hablemos" size="xl" variant="ink" />
        </Reveal>
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
            EDUARDO MARQUINA 3937, VITACURA<br />
            SANTIAGO, CHILE
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 22,
          fontSize: 11, fontFamily: FL.mono, color: FL.muted, letterSpacing: '0.08em',
        }}>
          <span>© DOPPEL · 2011—2026</span>
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
