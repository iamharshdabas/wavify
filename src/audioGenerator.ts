import * as wav from "wav"

/**
 * Writes an AudioBuffer to a WAV file.
 * @param {AudioBuffer} audioBuffer The AudioBuffer instance containing audio data to write.
 * @param {string} filePath The file system path where the WAV file will be saved.
 */
export async function writeAudioBufferToWav(
  audioBuffer: AudioBuffer,
  filePath: string,
): Promise<void> {
  try {
    console.log(`Writing AudioBuffer to WAV: ${filePath}`)
    console.log(`Channels: ${audioBuffer.numberOfChannels}`)
    console.log(`Sample Rate: ${audioBuffer.sampleRate}`)
    console.log(`Length (samples): ${audioBuffer.length}`)
    console.log(`Duration (seconds): ${audioBuffer.duration}`)

    const writer = new wav.FileWriter(filePath, {
      channels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
      bitDepth: 32, // Using 32-bit because AudioBuffer data is typically float32
    })

    // Wav FileWriter expects PCM (Pulse Code Modulation) audio data
    // Extract the Float32Array for each channel from the AudioBuffer.
    // Interleave the channel data into a single Float32Array.
    const numberOfChannels = audioBuffer.numberOfChannels
    const channelData: Float32Array[] = []
    for (let i = 0; i < numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i))
    }

    const length = audioBuffer.length
    const interleavedData = new Float32Array(length * numberOfChannels)
    // We are first iterating over the samples (length) and then over the channels (numberOfChannels).
    // We need to interleave the channel data into a single Float32Array.
    // Wav expects interleaved data in the following order for stereo:
    // [Left_Sample_1, Right_Sample_1, Left_Sample_2, Right_Sample_2, ...]
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < numberOfChannels; j++) {
        interleavedData[i * numberOfChannels + j] = channelData[j][i]
      }
    }

    // --- CRITICAL FIX ---
    // Convert the Float32Array to a Node.js Buffer as Wav FileWriter expects a Buffer.
    const pcmBuffer = Buffer.from(interleavedData.buffer)

    writer.write(pcmBuffer)
    writer.end()

    console.log("WAV file written successfully!")
  } catch (error) {
    console.error("Error writing WAV file:", error)
    throw error
  }
}
