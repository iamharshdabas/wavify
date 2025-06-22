import {
  BANDS,
  BASE_NOTE_SEGMENT_DURATION_MS,
  MIDI_NOTE_NUMBERS,
  MIDRANGE_NOTE_SEGMENT_DURATION_MS,
  TREBLE_NOTE_SEGMENT_DURATION_MS,
  VOLUME_FOR_ONE,
  VOLUME_FOR_ZERO,
} from "./musicConfig"
import type { Note } from "./types"

/**
 * Converts an input string into an array of music notes.
 * @param string The input string to convert into music notes.
 * @returns An array of music notes generated from the input string.
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
        currentNote = getNote(binaryString, "base", timeline, BASE_NOTE_SEGMENT_DURATION_MS)
        break
      }
      case BANDS.midrange: {
        currentNote = getNote(binaryString, "midrange", timeline, MIDRANGE_NOTE_SEGMENT_DURATION_MS)
        break
      }
      case BANDS.treble: {
        currentNote = getNote(binaryString, "treble", timeline, TREBLE_NOTE_SEGMENT_DURATION_MS)
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
      volume: binaryString[i] === "1" ? VOLUME_FOR_ONE : VOLUME_FOR_ZERO,
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

// TODO: Add more dynamic logic to determine the bands based on input length or content.
// You can use sentances to create Tempo, Drum, Timeout, etc.
// Tempo can be determined by the number of characters in the sentances.
// Drum can be determined by the number of words in the sentances.
// Timeout can be determined by the length of the sentance.
function getBands(length: number): number[] {
  const bands: number[] = []

  for (let i = 0; i < length; i++) {
    bands.push(i % 3) // Cycle through 0, 1, 2 for Base, Midrange, Treble
  }

  return bands
}

function toBinaryString(str: string): string {
  const abc = "abcdefghijklmnopqrstuvwxyz"
  const binary: number[] = []

  for (const chr of str) {
    if (abc.includes(chr)) {
      const index = abc.indexOf(chr.toLowerCase())
      binary.push(index % 2) // Convert to binary (0 or 1)
    } else {
      binary.push(1)
    }
  }

  return binary.join("")
}
