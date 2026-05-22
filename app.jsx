// app.jsx — host canvas with 3 variations + tweaks panel

const { DesignCanvas, DCSection, DCArtboard, DCNote } = window;

// Tweaks (currently just a compact info panel — could expand later)
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showNotes": true,
  "compactView": false
}/*EDITMODE-END*/;

function App() {
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Website artboard dimensions — desktop-ish proportions for each home page
  const W = 1280;
  const H = 2200;

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="funnel"
          title="Doppel — Landing funnel → WhatsApp"
          subtitle="Single-page conversion landing. Todos los CTAs apuntan a +56 9 2797 0014 con mensaje pre-llenado según sección."
        >
          <DCArtboard id="funnel" label="Landing funnel · doppel.cl" width={W} height={H + 1100}>
            <FunnelLanding />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="system"
          title="Sistema común"
          subtitle="La lógica que une las dos líneas"
        >
          <DCArtboard id="palette" label="Paleta compartida" width={560} height={360}>
            <PaletteCard />
          </DCArtboard>

          <DCArtboard id="architecture" label="Arquitectura de marca" width={560} height={360}>
            <ArchCard />
          </DCArtboard>

          <DCArtboard id="next" label="Siguientes pasos" width={560} height={360}>
            <NextCard />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="explorations"
          title="Exploraciones anteriores (archivo)"
          subtitle="V1 multi-sección + Studio dedicado + V2 y V3. Quedan de referencia."
        >
          <DCArtboard id="v1" label="V1 · Home multi-sección (vers. anterior)" width={W} height={H}>
            <V1Home />
          </DCArtboard>

          <DCArtboard id="pf" label="Doppel Studio · landing dedicada (ads)" width={W} height={H + 200}>
            <PodFactoryLanding />
          </DCArtboard>

          <DCArtboard id="v2" label="V2 · Split Brutal" width={W} height={H}>
            <V2Home />
          </DCArtboard>

          <DCArtboard id="v3" label="V3 · Retro Broadcast" width={W} height={H}>
            <V3Home />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

// ── System cards ──────────────────────────────────────────────

function PaletteCard() {
  const swatches = [
    { c: '#3B3D49', n: 'Doppel Principal', code: '#3B3D49' },
    { c: '#FF6633', n: 'Naranja (puente)', code: '#FF6633' },
    { c: '#FFCC33', n: 'Amarillo (puente)', code: '#FFCC33' },
    { c: '#99CCCC', n: 'Menta Doppel', code: '#99CCCC' },
    { c: '#1F3FA3', n: 'Azul Studio', code: '#1F3FA3' },
    { c: '#D92E2E', n: 'Rojo Studio', code: '#D92E2E' },
    { c: '#F5EBD6', n: 'Crema Studio', code: '#F5EBD6' },
    { c: '#0A0A0A', n: 'Negro', code: '#0A0A0A' },
  ];
  return (
    <div style={{ background: '#F5EBD6', color: '#0A0A0A', padding: 28, height: '100%', fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>
        SISTEMA CROMÁTICO · UNIFICADO
      </div>
      <h3 style={{ fontSize: 26, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Paleta compartida
      </h3>
      <p style={{ fontSize: 12, lineHeight: 1.45, margin: '8px 0 20px', color: '#0A0A0Acc', maxWidth: 440 }}>
        El naranja/amarillo del manual de Doppel coincide con la paleta del estudio:
        ese encuentro es el puente. Media usa el principal sobre oscuro; Studio toma
        la paleta completa sobre crema.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {swatches.map(s => (
          <div key={s.code}>
            <div style={{ background: s.c, height: 58, border: s.c === '#F5EBD6' ? '1px solid #0A0A0A30' : 'none' }} />
            <div style={{ fontSize: 10, marginTop: 6, fontWeight: 600 }}>{s.n}</div>
            <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: '#0A0A0A80' }}>{s.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchCard() {
  return (
    <div style={{ background: '#0E0E0E', color: '#F4EFE6', padding: 28, height: '100%', fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', fontFamily: "'Space Mono', monospace", marginBottom: 6, color: '#FF6633' }}>
        ARQUITECTURA DE MARCA
      </div>
      <h3 style={{ fontSize: 26, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Doppel: agencia 360°
      </h3>
      <p style={{ fontSize: 12, lineHeight: 1.45, margin: '8px 0 16px', color: '#F4EFE6cc', maxWidth: 440 }}>
        <b>Doppel</b> es la agencia creativa: idea, concepto, guión, dirección.
        <b> Media</b> y <b>Studio</b> son dónde la idea se materializa—no marcas
        separadas que defender.
      </p>
      <div style={{
        border: '1px solid #F4EFE630', padding: 16, fontFamily: "'Space Mono', monospace",
        fontSize: 11, lineHeight: 1.8,
      }}>
        <div>doppel.cl/</div>
        <div style={{ paddingLeft: 16 }}>├─ trabajos/ <span style={{ color: '#F4EFE680' }}>·· todo el portfolio</span></div>
        <div style={{ paddingLeft: 16 }}>├─ como-trabajamos/ <span style={{ color: '#F4EFE680' }}>·· el proceso 360°</span></div>
        <div style={{ paddingLeft: 16 }}>├─ <span style={{ color: '#FF6633' }}>media/ ·· audiovisual</span></div>
        <div style={{ paddingLeft: 16 }}>├─ <span style={{ color: '#F4B81C' }}>studio/ ·· podcast/vodcast (ads aquí)</span></div>
        <div style={{ paddingLeft: 16 }}>├─ nosotros/</div>
        <div style={{ paddingLeft: 16 }}>└─ contacto/</div>
      </div>
    </div>
  );
}

function NextCard() {
  return (
    <div style={{ background: '#F5EBD6', color: '#0A0A0A', padding: 28, height: '100%', fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', fontFamily: "'Space Mono', monospace", marginBottom: 6, color: '#D92E2E' }}>
        SIGUIENTES PASOS
      </div>
      <h3 style={{ fontSize: 26, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Qué hacemos con esto
      </h3>
      <ol style={{ fontSize: 13, lineHeight: 1.55, paddingLeft: 18, marginTop: 14 }}>
        <li style={{ marginBottom: 8 }}>
          <b>Logotipo de Studio</b>: definir si lleva isotipo propio o solo wordmark.
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>Páginas internas</b>: detalle de proyecto, reservar studio, nosotros.
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>Versión mobile</b> + interacciones (cursor, scroll-reveal, transiciones).
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>Reel real</b>: necesitamos tu video destacado + casos para reemplazar placeholders.
        </li>
      </ol>
      <div style={{
        marginTop: 8, padding: '10px 14px', background: '#0A0A0A', color: '#F5EBD6',
        fontSize: 11, fontFamily: "'Space Mono', monospace",
      }}>
        ▸ Contéstame en el chat y seguimos afinando.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
