export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const NOTE_DISPLAY = {
  'C':  'C',
  'C#': 'C♯/D♭',
  'D':  'D',
  'D#': 'D♯/E♭',
  'E':  'E',
  'F':  'F',
  'F#': 'F♯/G♭',
  'G':  'G',
  'G#': 'G♯/A♭',
  'A':  'A',
  'A#': 'A♯/B♭',
  'B':  'B',
}

export const SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
export const QUALITIES = ['Major', 'minor', 'minor', 'Major', 'Major', 'minor', 'diminished']
export const ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

export const VOICINGS = {
  'C':  ['x32010','xx0232','022000','320003','x02210','x32010','xx0232'],
  'C#': ['x43121','xx1354','x46664','x43121','x46664','x13321','xx4537'],
  'D':  ['xx0232','x00232','xx2220','xx0232','xx0232','xx0212','xx0131'],
  'D#': ['xx1341','x10340','xx3330','x65343','x65343','xx1301','xx1242'],
  'E':  ['022100','x22400','x21000','022100','022100','022000','xx2101'],
  'F':  ['133211','x33211','133111','133211','133211','133111','xx3211'],
  'F#': ['244322','x44322','244222','244322','244322','244222','xx4322'],
  'G':  ['320003','xx0433','210232','320003','320003','320033','xx0201'],
  'G#': ['466544','xx1114','321003','466544','466544','431114','xx1114'],
  'A':  ['x02220','xx2452','x02000','x02220','x02220','x02210','xx2101'],
  'A#': ['x13331','xx3563','x13111','x13331','x13331','x13321','xx3212'],
  'B':  ['x24442','xx4674','x24222','x24442','x24442','x24432','xx4323'],
}

export function getChords(keyNote) {
  const rootIdx = NOTES.indexOf(keyNote)
  return SCALE_INTERVALS.map((interval, degree) => {
    const noteIdx = (rootIdx + interval) % 12
    const note = NOTES[noteIdx]
    return {
      degree,
      roman: ROMAN_NUMERALS[degree],
      quality: QUALITIES[degree],
      chordName: note + (QUALITIES[degree] === 'minor' ? 'm' : QUALITIES[degree] === 'diminished' ? 'dim' : ''),
      voicing: VOICINGS[note][degree],
    }
  })
}
