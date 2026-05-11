import { useState } from 'react'
import { NOTES, NOTE_DISPLAY, getChords } from './music'
import FretboardDiagram from './FretboardDiagram'
import './App.css'

const CAPO_OPTIONS = [
  { value: 0, label: 'No capo' },
  ...Array.from({ length: 7 }, (_, i) => ({ value: i + 1, label: `Fret ${i + 1}` })),
]

function badgeColors(roman, active) {
  if (active) {
    if (roman === 'I' || roman === 'IV' || roman === 'V') {
      return { color: '#93c5fd', background: 'rgba(255,255,255,0.12)' }
    }
    if (roman === 'ii' || roman === 'iii' || roman === 'vi') {
      return { color: '#c4b5fd', background: 'rgba(255,255,255,0.12)' }
    }
    return { color: '#fcd34d', background: 'rgba(255,255,255,0.12)' }
  }
  if (roman === 'I' || roman === 'IV' || roman === 'V') {
    return { color: '#1e40af', background: '#dbeafe' }
  }
  if (roman === 'ii' || roman === 'iii' || roman === 'vi') {
    return { color: '#5b21b6', background: '#ede9fe' }
  }
  return { color: '#92400e', background: '#fef3c7' }
}

function ChordCard({ chord, active, onTap }) {
  const { roman, quality, chordName, voicing } = chord
  const badge = badgeColors(roman, active)

  return (
    <div
      className={`chord-card${active ? ' chord-card--active' : ''}`}
      onClick={onTap}
    >
      <div className="chord-card__left">
        <span className="chord-card__roman" style={{ color: badge.color, background: badge.background }}>
          {roman}
        </span>
        <span className="chord-card__name">{chordName}</span>
        <span className="chord-card__quality">{quality}</span>
      </div>
      <div className="chord-card__diagram">
        <FretboardDiagram voicing={voicing} active={active} />
      </div>
    </div>
  )
}

export default function App() {
  const [keyIdx, setKeyIdx] = useState(0)
  const [capo, setCapo] = useState(0)
  const [activeCard, setActiveCard] = useState(null)

  const shapeKeyIdx = (keyIdx - capo + 12) % 12
  const shapeKey = NOTES[shapeKeyIdx]
  const chords = getChords(shapeKey)

  const handleCardTap = (i) => {
    setActiveCard(prev => (prev === i ? null : i))
  }

  const handleKeyChange = (e) => {
    setKeyIdx(Number(e.target.value))
    setActiveCard(null)
  }

  const handleCapoChange = (e) => {
    setCapo(Number(e.target.value))
    setActiveCard(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">Fretkey</h1>
        <p className="header__subtitle">Diatonic chord reference for guitar</p>
      </header>

      <div className="controls">
        <div className="control-row">
          <span className="control-label">KEY</span>
          <select className="control-select" value={keyIdx} onChange={handleKeyChange}>
            {NOTES.map((note, i) => (
              <option key={note} value={i}>{NOTE_DISPLAY[note]} Major</option>
            ))}
          </select>
        </div>

        <div className="control-row">
          <span className="control-label">CAPO</span>
          <div className="control-select-wrap">
            <select className="control-select" value={capo} onChange={handleCapoChange}>
              {CAPO_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {capo > 0 && (
              <span className="capo-hint">Play {NOTE_DISPLAY[shapeKey]} shapes</span>
            )}
          </div>
        </div>
      </div>

      <main className="chord-list">
        {chords.map((chord, i) => (
          <ChordCard
            key={i}
            chord={chord}
            active={activeCard === i}
            onTap={() => handleCardTap(i)}
          />
        ))}
      </main>
    </div>
  )
}
