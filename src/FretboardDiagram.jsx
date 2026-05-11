export default function FretboardDiagram({ voicing, active }) {
  const strings = voicing.split('')
  const fretNums = strings.filter(s => s !== 'x' && s !== '0').map(Number)
  const minFret = fretNums.length > 0 ? Math.min(...fretNums) : 1
  const startsAtNut = minFret === 1 || strings.includes('0')
  const fretOffset = startsAtNut ? 0 : minFret - 1
  const numFrets = 4

  const W = 140
  const H = 115

  // Horizontal layout: frets go left→right, strings go top(high e)→bottom(low E)
  const leftMargin = 20   // zone left of nut for muted/open markers
  const nutW = 6          // nut bar thickness
  const rightPad = 6
  const topPad = 10       // above high e
  const bottomPad = 10    // below low E

  const nutX = leftMargin
  const gridLeft = nutX + nutW           // where fret grid begins
  const gridRight = W - rightPad        // = 134
  const gridW = gridRight - gridLeft    // = 108 for 4 frets
  const gridTop = topPad                // = 10
  const gridBottom = H - bottomPad     // = 105
  const gridH = gridBottom - gridTop   // = 95 for 6 strings

  // i=0 → high e (top), i=5 → low E (bottom)
  const stringY = i => gridTop + (i * gridH) / 5

  const fretLineX = f => gridLeft + (f * gridW) / numFrets
  const fretCenterX = rel => gridLeft + ((rel - 0.5) * gridW) / numFrets

  const lineColor = active ? 'rgba(255,255,255,0.35)' : '#9aa5b8'
  const nutColor = active ? 'rgba(255,255,255,0.7)' : '#1e2d4a'
  const dotFill = active ? '#ffffff' : '#0f2044'
  const dotText = active ? '#0f2044' : '#ffffff'
  const openStroke = active ? 'rgba(255,255,255,0.8)' : '#64748b'
  const mutedColor = active ? 'rgba(255,255,255,0.6)' : '#64748b'
  const labelColor = active ? 'rgba(255,255,255,0.7)' : '#64748b'
  const markerX = 10  // center of marker zone, left of nut

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

      {/* String lines — confined to fret grid only, never past the nut */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i}
          x1={gridLeft} y1={stringY(i)}
          x2={gridRight} y2={stringY(i)}
          stroke={lineColor} strokeWidth={1}
        />
      ))}

      {/* Nut bar — only for at-nut chords */}
      {startsAtNut && (
        <rect x={nutX} y={gridTop} width={nutW} height={gridH} fill={nutColor} rx={1} />
      )}

      {/* Fret lines — vertical */}
      {Array.from({ length: numFrets + 1 }, (_, f) => (
        <line key={f}
          x1={fretLineX(f)} y1={gridTop}
          x2={fretLineX(f)} y2={gridBottom}
          stroke={lineColor} strokeWidth={1}
        />
      ))}

      {/* Fret position label for off-nut chords — sits above the first fret cell */}
      {!startsAtNut && (
        <text x={fretCenterX(1)} y={gridTop - 1}
          textAnchor="middle" fontSize="9"
          fill={labelColor}
          fontFamily="system-ui, -apple-system, sans-serif">
          {fretOffset + 1}fr
        </text>
      )}

      {/* Per-string markers */}
      {strings.map((s, vi) => {
        // vi=0 = low E (voicing index), vi=5 = high e
        // drawIdx=0 = high e (top of diagram), drawIdx=5 = low E (bottom)
        const drawIdx = 5 - vi
        const y = stringY(drawIdx)

        if (s === 'x') {
          return (
            <text key={vi} x={markerX} y={y + 4}
              textAnchor="middle" fontSize="10"
              fill={mutedColor}
              fontFamily="system-ui, -apple-system, sans-serif">✕</text>
          )
        }
        if (s === '0') {
          return (
            <circle key={vi} cx={markerX} cy={y} r={4.5}
              fill="none" stroke={openStroke} strokeWidth={1.5} />
          )
        }
        const fret = Number(s)
        const relFret = fret - fretOffset
        const cx = fretCenterX(relFret)
        return (
          <g key={vi}>
            <circle cx={cx} cy={y} r={8} fill={dotFill} />
            <text x={cx} y={y + 3.5}
              textAnchor="middle" fontSize="9"
              fill={dotText} fontWeight="600"
              fontFamily="system-ui, -apple-system, sans-serif">
              {fret}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
