/** The original illustrated guitar emblem from the prototype — used as a
 *  placeholder wherever a photo hasn't been uploaded yet. */
export function GuitarEmblem({
  width = 110,
  height = 238,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 260" aria-hidden="true">
      <defs>
        <radialGradient id="ogcBurst" cx="50%" cy="58%" r="62%">
          <stop offset="0%" stopColor="#D6A25C" />
          <stop offset="55%" stopColor="#B47B36" />
          <stop offset="100%" stopColor="#6E3F16" />
        </radialGradient>
        <linearGradient id="ogcNeck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4A3018" />
          <stop offset="50%" stopColor="#6B4523" />
          <stop offset="100%" stopColor="#3C2712" />
        </linearGradient>
      </defs>
      {/* body */}
      <path
        d="M60,116 C84,116 92,130 92,142 C92,154 84,158 84,166 C84,176 98,182 98,204 C98,232 82,248 60,248 C38,248 22,232 22,204 C22,182 36,176 36,166 C36,158 28,154 28,142 C28,130 36,116 60,116 Z"
        fill="url(#ogcBurst)"
        stroke="#2A1A0C"
        strokeWidth="2.5"
      />
      {/* binding highlight */}
      <path
        d="M60,120 C81,120 88,132 88,142 C88,153 80,157 80,166 C80,177 94,183 94,204 C94,229 80,244 60,244 C40,244 26,229 26,204 C26,183 40,177 40,166 C40,157 32,153 32,142 C32,132 39,120 60,120 Z"
        fill="none"
        stroke="#E8D3A8"
        strokeWidth="1"
        opacity=".5"
      />
      {/* rosette + soundhole */}
      <circle cx="60" cy="153" r="19" fill="none" stroke="#E8D3A8" strokeWidth="1.4" opacity=".85" />
      <circle cx="60" cy="153" r="16.5" fill="none" stroke="#5A3413" strokeWidth="2.4" />
      <circle cx="60" cy="153" r="14" fill="#1C1106" />
      {/* headstock */}
      <path d="M51,6 L69,6 L71,38 L49,38 Z" fill="#33200F" stroke="#201307" strokeWidth="1" />
      <circle cx="45" cy="13" r="2.6" fill="#C9B68E" />
      <circle cx="45" cy="22" r="2.6" fill="#C9B68E" />
      <circle cx="45" cy="31" r="2.6" fill="#C9B68E" />
      <circle cx="75" cy="13" r="2.6" fill="#C9B68E" />
      <circle cx="75" cy="22" r="2.6" fill="#C9B68E" />
      <circle cx="75" cy="31" r="2.6" fill="#C9B68E" />
      {/* neck + fretboard */}
      <rect x="52" y="38" width="16" height="82" fill="url(#ogcNeck)" />
      <rect x="52" y="118" width="16" height="18" fill="#33200F" />
      <rect x="51" y="36" width="18" height="3.4" fill="#E8D3A8" />
      <g stroke="#C9B68E" strokeWidth="1" opacity=".8">
        <line x1="52" y1="50" x2="68" y2="50" />
        <line x1="52" y1="61" x2="68" y2="61" />
        <line x1="52" y1="72" x2="68" y2="72" />
        <line x1="52" y1="82" x2="68" y2="82" />
        <line x1="52" y1="92" x2="68" y2="92" />
        <line x1="52" y1="101" x2="68" y2="101" />
        <line x1="52" y1="110" x2="68" y2="110" />
        <line x1="52" y1="118" x2="68" y2="118" />
        <line x1="52" y1="126" x2="68" y2="126" />
      </g>
      <circle cx="60" cy="66.5" r="1.7" fill="#E8D3A8" />
      <circle cx="60" cy="87" r="1.7" fill="#E8D3A8" />
      <circle cx="57" cy="105.5" r="1.5" fill="#E8D3A8" />
      <circle cx="63" cy="105.5" r="1.5" fill="#E8D3A8" />
      {/* bridge */}
      <rect x="42" y="196" width="36" height="10" rx="2.5" fill="#26170A" />
      <line x1="45" y1="199" x2="75" y2="199" stroke="#E8D3A8" strokeWidth="1.2" />
      <g fill="#C9B68E">
        <circle cx="47" cy="203" r="1.3" />
        <circle cx="52.2" cy="203" r="1.3" />
        <circle cx="57.4" cy="203" r="1.3" />
        <circle cx="62.6" cy="203" r="1.3" />
        <circle cx="67.8" cy="203" r="1.3" />
        <circle cx="73" cy="203" r="1.3" />
      </g>
      {/* strings */}
      <g stroke="#F1E6D1" strokeWidth=".8" opacity=".85">
        <line x1="55" y1="38" x2="47" y2="199" />
        <line x1="57" y1="38" x2="52.2" y2="199" />
        <line x1="59" y1="38" x2="57.4" y2="199" />
        <line x1="61" y1="38" x2="62.6" y2="199" />
        <line x1="63" y1="38" x2="67.8" y2="199" />
        <line x1="65" y1="38" x2="73" y2="199" />
      </g>
      {/* soft top highlight */}
      <ellipse cx="44" cy="188" rx="14" ry="30" fill="#FFFFFF" opacity=".07" />
    </svg>
  );
}
