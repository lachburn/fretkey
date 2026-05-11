export default function FretboardDiagram({ voicing, active }) {
  const strings = voicing.split('')
  const fretNums = strings.filter(s => s !== 'x' && s !== '0').map(Number)
  const minFret = fretNums.length > 0 ? Math.min(...fretNums) : 1
  const maxFret = fretNums.length > 0 ? Math.max(...fretNums) : 4
  const startsAtNut = minFret === 1
  const fretOffset = startsAtNut ? 0 : minFret - 1
  const numFrets = 4

  const W = 110
  const H = 96
  const nutH = 5
  const topPad = 20   // space above nut for open/muted markers
  const leftPad = startsAtNut ? 10 : 22
  const rightPad = 8
  const bottomPad = 6

  const gridW = W - leftPad - rightPad
  const gridH = H - topPad - nutH - bottomPad

  const stringX = i => leftPad + (i * gridW) / 5
  const fretY = f => topPad + nutH + (f * gridH) / numFrets

  const lineColor = active ? 'rgba(255,255,255,0.35)' : '#9aa5b8'
  const nutColor = active ? 'rgba(255,255,255,0.7)' : '#1e2d4a'
  const dotFill = active ? '#ffffff' : '#0f2044'
  const dotText = active ? '#0f2044' : '#ffffff'
  const openCircleStroke = active ? 'rgba(255,255,255,0.8)' : '#64748b'
  const mutedColor = active ? 'rgba(255,255,255,0.6)' : '#64748b'
  const labelColor = active ? 'rgba(255,255,255,0.7)' : '#64748b'

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* Fret position label when not at nut */}
      {!startsAtNut && (
        <text
          x={leftPad - 3}
          y={topPad + nutH + gridH / numFrets / 2 + 4}
          fontSize="9"
          fill={labelColor}
          textAnchor="end"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {fretOffset + 1}fr
        </text>
      )}

      {/* Nut */}
      {startsAtNut && (
        <rect
          x={leftPad}
          y={topPad}
          width={gridW}
          height={nutH}
          fill={nutColor}
          rx={1}
        />
      )}

      {/* Fret lines */}
      {Array.from({ length: numFrets + 1 }, (_, f) => (
        <line
          key={f}
          x1={leftPad}
          y1={fretY(f)}
          x2={leftPad + gridW}
          y2={fretY(f)}
          stroke={lineColor}
          strokeWidth={f === 0 && !startsAtNut ? 1 : 1}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={stringX(i)}
          y1={topPad + nutH}
          x2={stringX(i)}
          y2={topPad + nutH + gridH}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* Per-string markers */}
      {strings.map((s, i) => {
        const x = stringX(i)
        if (s === 'x') {
          return (
            <text
              key={i}
              x={x}
              y={topPad - 5}
              textAnchor="middle"
              fontSize="10"
              fill={mutedColor}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              ✕
            </text>
          )
        }
        if (s === '0') {
          return (
            <circle
              key={i}
              cx={x}
              cy={topPad - 7}
              r={4}
              fill="none"
              stroke={openCircleStroke}
              strokeWidth={1.5}
            />
          )
        }
        const fret = Number(s)
        const relFret = fret - fretOffset
        const cy = fretY(relFret - 1) + gridH / numFrets / 2
        return (
          <g key={i}>
            <circle cx={x} cy={cy} r={7} fill={dotFill} />
            <text
              x={x}
              y={cy + 4}
              textAnchor="middle"
              fontSize="9"
              fill={dotText}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="600"
            >
              {fret}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
