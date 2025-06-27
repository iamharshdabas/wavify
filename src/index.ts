import { writeAudioBufferToWav } from "./audioGenerator"
import { renderNotesToAudioBuffer } from "./audioRenderer"
import { generateNotes } from "./textToNotes"

async function main() {
  const inputString = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac ultrices libero. Cras eu quam sagittis, pharetra metus sit amet, lobortis leo. Mauris eget mi leo. Pellentesque vitae sapien augue. Duis lacinia ante in elit interdum ullamcorper. Pellentesque vestibulum eget magna blandit feugiat. Proin et ligula convallis, tincidunt purus ut, consectetur tellus. Quisque laoreet ligula eu nisi scelerisque, blandit gravida velit pulvinar. Vestibulum at ante non arcu laoreet vulputate. Proin lectus nisi, imperdiet quis nunc in, viverra ullamcorper lacus. Aliquam nec aliquam ex. In consequat elementum nibh, non tincidunt neque aliquam mollis. Nullam odio purus, rutrum ut luctus eu, venenatis nec neque. Phasellus enim enim, scelerisque sit amet placerat vel, ultrices eu elit.
`

  const outputFileName = "generated_music_from_text.wav"

  try {
    console.log(`Generating audio notes from input string: "${inputString}"...`)
    const notes = generateNotes(inputString)
    console.log("Audio notes generated. Rendering to audio buffer...")

    const audioBuffer = await renderNotesToAudioBuffer(notes)
    console.log("Audio buffer generated. Saving to WAV file...")

    await writeAudioBufferToWav(audioBuffer, outputFileName)
    console.log(`Successfully created '${outputFileName}'`)
  } catch (error) {
    console.error("Failed to generate or write WAV file:", error)
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error)
})
