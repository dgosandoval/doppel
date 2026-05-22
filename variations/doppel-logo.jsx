// Doppel logo + isotipo as clean SVG, recreated from the brand manual.
// Wordmark uses Lao MN Bold-style proxy (Archivo Black is the closest free
// match available); isotipo recreates the two semicircles per manual 1.08.

function DoppelLogoMark({ height = 32, color = '#3B3D49' }) {
  // Wordmark "doppel." — geometric, dot accent at end
  return (
    <svg viewBox="0 0 280 80" height={height} style={{ display: 'block', overflow: 'visible' }}>
      <text
        x="0" y="62"
        fontFamily="'Archivo Black', 'Archivo', sans-serif"
        fontWeight="900"
        fontSize="76"
        letterSpacing="-3"
        fill={color}
      >doppel.</text>
    </svg>
  );
}

// The isotipo: a stylized "p" formed by two semicircles
// Top: mint #99CCCC, overlap with yellow #FFCC33 creates olive #8BA632 mid-tone
function DoppelIsotipo({ size = 48 }) {
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} style={{ display: 'block' }}>
      {/* Top mint semicircle (open right side, like upper part of "p") */}
      <path d="M 50 10 A 40 40 0 0 1 50 90 L 50 50 Z M 50 10 L 50 50 A 40 40 0 0 0 50 10 Z" fill="#99CCCC" />
      <circle cx="50" cy="50" r="40" fill="#99CCCC" />
      {/* Bottom yellow semicircle, offset down-left like the descender */}
      <circle cx="40" cy="90" r="40" fill="#FFCC33" style={{ mixBlendMode: 'multiply' }} />
      {/* Stem — vertical bar */}
      <rect x="46" y="10" width="8" height="120" fill="#99CCCC" style={{ mixBlendMode: 'multiply' }} />
    </svg>
  );
}

// Combined lockup: isotipo + wordmark side-by-side
function DoppelLockup({ height = 32, color = '#3B3D49', showIso = true }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.35 }}>
      {showIso && <DoppelIsotipo size={height} />}
      <DoppelLogoMark height={height} color={color} />
    </span>
  );
}

window.DoppelLogoMark = DoppelLogoMark;
window.DoppelIsotipo = DoppelIsotipo;
window.DoppelLockup = DoppelLockup;
