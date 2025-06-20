export type Note = {
  midiNoteNumber: number
  startTimeMs: number
  durationMs: number
  volumeAutomation: { timeOffsetMs: number; volume: number }[]
}

const BANDS = {
  base: 0,
  midrange: 1,
  treble: 2,
} as const

// using c minor pentatonic for an r&b feel
const MIDI_NOTE_NUMBERS: Record<keyof typeof BANDS, number[]> = {
  base: [36, 39, 41, 43, 46], // C2, Eb2, F2, G2, Bb2
  midrange: [60, 63, 65, 67, 70], // C4, Eb4, F4, G4, Bb4
  treble: [84, 87, 89, 91, 94], // C6, Eb6, F6, G6, Bb6
} as const

/**
 * @module this will generate music notes
 * @param string a string of notes to be generated
 * @returns an array of Note objects
 */
export function generateNotes(input: string): Note[] {
  if (!input || input.length === 0 || typeof input !== "string") {
    throw new Error("Input must be a non-empty string")
  }

  const binaryStrings = input.split(" ").map(toBinaryString)
  const bands = getBands(binaryStrings.length)

  const notes = getNotes(binaryStrings, bands)
  console.log(JSON.stringify(notes, null, 2))
  return notes
}

function getNotes(binaryStrings: string[], bands: number[]): Note[] {
  if (binaryStrings.length === 0 || bands.length === 0) {
    throw new Error("Binary string and bands must not be empty")
  }

  if (binaryStrings.length !== bands.length) {
    throw new Error("Binary string and bands must have the same length")
  }

  const notes: Note[] = []
  let timeline = 0

  for (let i = 0; i < bands.length; i++) {
    const binaryString = binaryStrings[i]
    if (!binaryString) throw new Error("Binary string must not be empty")

    let currentNote: Note

    switch (bands[i]) {
      case BANDS.base: {
        currentNote = getNote(binaryString, "base", timeline, 1000)
        break
      }
      case BANDS.midrange: {
        currentNote = getNote(binaryString, "midrange", timeline, 250)
        break
      }
      case BANDS.treble: {
        currentNote = getNote(binaryString, "treble", timeline, 125)
        break
      }
      default:
        throw new Error("Invalid band type")
    }

    notes.push(currentNote)
    timeline += currentNote.durationMs
  }

  return notes
}

function getNote(
  binaryString: string,
  band: keyof typeof BANDS,
  startTimeMs: number,
  timeOffsetMs: number,
): Note {
  const midiBand = MIDI_NOTE_NUMBERS[band]
  const midiNoteNumber = midiBand[parseInt(binaryString, 2) % midiBand.length]
  if (midiNoteNumber === undefined) {
    throw new Error(
      `Invalid MIDI note number derived from binary string: "${binaryString}" for band: "${band}"`,
    )
  }

  const length = binaryString.length
  const durationMs = length * timeOffsetMs

  let localTimeline = 0
  const volumeAutomation: Note["volumeAutomation"] = []
  for (let i = 0; i < length; i++) {
    volumeAutomation.push({
      timeOffsetMs: localTimeline,
      volume: binaryString[i] === "1" ? 0.8 : 0.2,
    })
    localTimeline += timeOffsetMs
  }

  return {
    midiNoteNumber,
    startTimeMs,
    durationMs,
    volumeAutomation,
  }
}

function getBands(length: number): number[] {
  const bands: number[] = []

  for (let i = 0; i < length; i++) {
    bands.push(i % 3) // cycle through 0, 1, 2 for base, midrange, treble
  }

  return bands
}

function toBinaryString(str: string): string {
  const abc = "abcdefghijklmnopqrstuvwxyz"
  const binary: number[] = []

  for (const chr of str) {
    if (abc.includes(chr)) {
      const index = abc.indexOf(chr.toLowerCase())
      binary.push(index % 2) // convert to binary (0 or 1)
    } else {
      binary.push(1)
    }
  }

  return binary.join("")
}
