import {
  type BANDS,
  BASS_BAND_WORD_LENGTH,
  BASS_NOTE_SEGMENT_DURATION_MS,
  BASS_TIMELINE_OFFSET,
  MID_NOTE_SEGMENT_DURATION_MS,
  MID_TIMELINE_OFFSET,
  MIDI_NOTE_NUMBERS,
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

  const words = input.split(" ")
  const notes: Note[] = []
  const bandTimelines: Record<keyof typeof BANDS, number> = {
    bass: BASS_TIMELINE_OFFSET,
    mid: MID_TIMELINE_OFFSET,
  }

  words.forEach((word) => {
    const binaryString = toBinaryString(word)
    const band = getBandForWord(word)
    const startTimeMs = bandTimelines[band]

    const note = getNote(binaryString, band, startTimeMs)
    notes.push(note)
    bandTimelines[band] += note.durationMs
  })

  console.log(JSON.stringify(notes, null, 2))
  return notes
}

function getNote(binaryString: string, band: keyof typeof BANDS, startTimeMs: number): Note {
  const midiBand = MIDI_NOTE_NUMBERS[band]
  const midiNoteNumber = midiBand[parseInt(binaryString, 2) % midiBand.length]
  if (midiNoteNumber === undefined) {
    throw new Error(`Invalid MIDI note number derived from binary string: "${binaryString}" for band: "${band}"`)
  }

  const durationMs = getDurationForBand(band, binaryString.length)

  let localTimeline = 0
  const volumeAutomation: Note["volumeAutomation"] = []
  for (let i = 0; i < binaryString.length; i++) {
    volumeAutomation.push({
      timeOffsetMs: localTimeline,
      volume: binaryString[i] === "1" ? VOLUME_FOR_ONE : VOLUME_FOR_ZERO,
    })
    localTimeline += getSegmentDurationForBand(band)
  }

  return {
    durationMs,
    midiNoteNumber,
    startTimeMs,
    volumeAutomation,
  }
}

function getBandForWord(word: string): keyof typeof BANDS {
  const length = word.length
  if (length > BASS_BAND_WORD_LENGTH) return "bass"
  return "mid"
}

function getDurationForBand(band: keyof typeof BANDS, binaryStringLength: number): number {
  // Make duration somewhat dynamic based on binary string length
  return getSegmentDurationForBand(band) * binaryStringLength
}

function getSegmentDurationForBand(band: keyof typeof BANDS): number {
  switch (band) {
    case "bass":
      return BASS_NOTE_SEGMENT_DURATION_MS
    case "mid":
      return MID_NOTE_SEGMENT_DURATION_MS
  }
}

function toBinaryString(str: string): string {
  const abc = "abcdefghijklmnopqrstuvwxyz"
  return Array.from(str)
    .map((chr) => {
      if (abc.includes(chr)) {
        const index = abc.indexOf(chr.toLowerCase())
        return index % 2
      } else {
        return 1
      }
    })
    .join("")
}
