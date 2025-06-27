export type Note = {
  midiNoteNumber?: number
  startTimeMs: number
  durationMs: number
  volumeAutomation: { timeOffsetMs: number; volume: number }[]
}
