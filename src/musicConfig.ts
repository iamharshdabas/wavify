export const BANDS = { base: 0, midrange: 1, treble: 2 }

// Using C Minor Pentatonic for an R&B feel.
// TODO: Add more bands or change the notes to fit different genres.
export const MIDI_NOTE_NUMBERS: Record<keyof typeof BANDS, number[]> = {
  base: [36, 39, 41, 43, 46], // C2, Eb2, F2, G2, Bb2
  midrange: [60, 63, 65, 67, 70], // C4, Eb4, F4, G4, Bb4
  treble: [84, 87, 89, 91, 94], // C6, Eb6, F6, G6, Bb6
}

export const BASE_NOTE_SEGMENT_DURATION_MS = 1000 // Duration of each binary digit for base band
export const MIDRANGE_NOTE_SEGMENT_DURATION_MS = 250 // Duration of each binary digit for midrange band
export const TREBLE_NOTE_SEGMENT_DURATION_MS = 125 // Duration of each binary digit for treble band

export const VOLUME_FOR_ONE = 0.8 // Volume if binary digit is '1'
export const VOLUME_FOR_ZERO = 0.2 // Volume if binary digit is '0'
