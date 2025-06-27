import * as wav from "wav"

/**
 * Writes an AudioBuffer to a WAV file.
 * @param {AudioBuffer} audioBuffer The AudioBuffer instance containing audio data to write.
 * @param {string} filePath The file system path where the WAV file will be saved.
 */
export async function writeAudioBufferToWav(audioBuffer: AudioBuffer, filePath: string): Promise<void> {
  try {
    const writer = new wav.FileWriter(filePath, {
      bitDepth: 16,
      channels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
    })

    // Wav expects Pulse Code Modulation (PCM) audio data and AudioBuffer contains Float32 data.
    const pcmBuffer = convertAudioBufferTo16BitPCMBuffer(audioBuffer)

    writer.write(pcmBuffer)
    writer.end()

    console.log("WAV file written successfully!")
  } catch (error) {
    console.error("Error writing WAV file:", error)
    throw error
  }
}

function convertAudioBufferTo16BitPCMBuffer(audioBuffer: AudioBuffer): Buffer {
  const numberOfChannels = audioBuffer.numberOfChannels
  const channelData: Float32Array[] = []
  for (let i = 0; i < numberOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i))
  }

  if (!channelData || channelData.length === 0 || !channelData[0]) {
    return Buffer.alloc(0)
  }

  const length = channelData[0].length
  const totalSamples = length * numberOfChannels

  const interleavedData = new Float32Array(totalSamples)

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < numberOfChannels; j++) {
      const channelSample = channelData[j]?.[i] ?? 0
      interleavedData[i * numberOfChannels + j] = channelSample
    }
  }

  const pcmData = new Int16Array(totalSamples)
  const maxInt16Positive = 32767
  const minInt16Negative = -32768

  for (let i = 0; i < totalSamples; i++) {
    let val = interleavedData[i]

    // Clamp the value to the -1.0 to 1.0 range
    val = Math.max(-1, Math.min(1, val ?? 0))

    // Scale to 16-bit integer range
    // Using explicit min/max values for scaling can be more robust.
    if (val >= 0) {
      pcmData[i] = Math.round(val * maxInt16Positive)
    } else {
      pcmData[i] = Math.round(val * minInt16Negative)
    }
  }

  return Buffer.from(pcmData.buffer)
}
