/** biome-ignore-all assist/source/useSortedKeys: flase */
export const BANDS = {
  bass: 0,
  mid: 1,
}

// Phonk-inspired scales and notes
export const MIDI_NOTE_NUMBERS: Record<keyof typeof BANDS, number[]> = {
  bass: [29, 33, 36, 40, 43], // F1, A1, C2, Eb2, F2
  mid: [53, 57, 60, 64, 67], // F5, A5, C6, Eb6, F6
}

export const BASS_BAND_WORD_LENGTH = 6
export const SAMPLING_RATE = 44100

export const BASS_TIMELINE_OFFSET = 0
export const MID_TIMELINE_OFFSET = 1000

export const BASS_NOTE_SEGMENT_DURATION_MS = 500
export const MID_NOTE_SEGMENT_DURATION_MS = 500

export const VOLUME_FOR_ONE = 0.8
export const VOLUME_FOR_ZERO = 0.2
