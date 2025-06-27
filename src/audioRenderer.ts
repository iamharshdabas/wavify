import { OfflineAudioContext } from "node-web-audio-api"
import { SAMPLING_RATE } from "./musicConfig"
import type { Note } from "./types"

/**
 * Renders an array of Note objects into an AudioBuffer using an OfflineAudioContext.
 * @param {Note[]} notes An array of Note objects to render.
 * @param {number} sampleRate Audio sample rate (defaults to 44100 Hz).
 * @returns {Promise<AudioBuffer>} A Promise that resolves with the generated AudioBuffer.
 */
export async function renderNotesToAudioBuffer(
  notes: Note[],
  sampleRate: number = SAMPLING_RATE,
): Promise<AudioBuffer> {
  console.log("Core Audio Renderer: Starting offline audio rendering...")

  const totalDurationMs = calculateTotalNotesDurationMs(notes)

  const offlineAudioContext = new OfflineAudioContext(1, Math.ceil((totalDurationMs * sampleRate) / 1000), sampleRate)

  // An AudioContext uses Nodes to create AudioGraph.
  // Source Nodes -> Processor Nodes -> Destination Node.
  // We are using OscillatorNode for sound generation and GainNode for volume control.
  // TODO: Refactor this to use a more modular approach.
  notes.forEach((note) => {
    createAndScheduleNote(offlineAudioContext, note)
  })

  const audioBuffer = await offlineAudioContext.startRendering()
  console.log("Core Audio Renderer: Offline audio rendering complete.")
  return audioBuffer
}

function createAndScheduleNote(offlineAudioContext: OfflineAudioContext, note: Note) {
  const startTimeSec = note.startTimeMs / 1000
  const stopTimeSec = startTimeSec + note.durationMs / 1000

  // Only create oscillator and gain node if it's not a rest note
  if (note.midiNoteNumber !== undefined) {
    const frequency = midiToFrequency(note.midiNoteNumber as number)

    const oscillator = offlineAudioContext.createOscillator()
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(frequency, offlineAudioContext.currentTime + startTimeSec)

    const gainNode = offlineAudioContext.createGain()
    gainNode.gain.setValueAtTime(1, offlineAudioContext.currentTime + startTimeSec)

    oscillator.connect(gainNode)
    gainNode.connect(offlineAudioContext.destination)

    // For each volume automation point, we set the gain value at the specified time offset.
    note.volumeAutomation.forEach((automationPoint) => {
      const automationAbsTimeSec = (note.startTimeMs + automationPoint.timeOffsetMs) / 1000
      gainNode.gain.linearRampToValueAtTime(
        automationPoint.volume,
        offlineAudioContext.currentTime + automationAbsTimeSec,
      )
    })

    oscillator.start(offlineAudioContext.currentTime + startTimeSec)
    oscillator.stop(offlineAudioContext.currentTime + stopTimeSec)
  }
}

function calculateTotalNotesDurationMs(notes: Note[]) {
  const timeMs = notes.reduce((max, note) => {
    const lastAutomationTime = note.volumeAutomation.reduce((maxOffset, va) => Math.max(maxOffset, va.timeOffsetMs), 0)
    return Math.max(max, note.startTimeMs + lastAutomationTime)
  }, 0)

  return timeMs
}

function midiToFrequency(midiNoteNumber: number): number {
  return 440 * 2 ** ((midiNoteNumber - 69) / 12)
}
