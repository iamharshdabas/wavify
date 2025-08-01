# Wavify 🎶 - Turn Your Text into Tunes

Wavify is an experimental project that transforms plain text into unique
waveform audio. It's a fun way to hear your words come alive as sound!

## How It Works ⚙️

Wavify processes text in a few simple steps:

1. **Text to Binary:** Each character in your input text is converted into a
   binary sequence. This forms the foundational "code" for the music.
2. **Binary to Notes:** The binary sequences are then mapped to musical notes.
   They are assigned to different "bands" – base, midrange, and treble –
   creating a layered sound.
3. **Volume Automation:** The '0's and '1's in the binary sequence control the
   volume of the notes over short segments. This creates dynamic, rhythmic patterns.
4. **Audio Generation:** These musical notes, with their specific frequencies
   and volume changes, are rendered into a raw audio buffer.
5. **WAV File Output:** Finally, this raw audio is encoded and saved as a
   standard WAV audio file.

## Features ✨

Currently, Wavify focuses on its core functionality:

- **Text-to-WAV Conversion:** Convert any input string into a playable WAV
  audio file.
- **Algorithmic Music Generation:** Experience unique, procedurally generated
  melodies and rhythms based on your text.
- **Simple Output:** Provides a clear, uncompressed WAV audio file for easy playback.

## Why Wavify? 🎵

My journey into Wavify started from a simple pleasure: listening to music while
I code. I'm particularly drawn to **Angelcore** – its atmospheric vibes,
distorted basslines, and lo-fi aesthetic keep me in the zone.

Something like [archangel](https://music.youtube.com/watch?v=mkhRRLRUqLY).

I wanted to see if I could create something similar – not necessarily a full
Angelcore track, but a system that generates interesting, rhythmic, and
layered audio. Wavify is my initial attempt to build a personal musical
companion, turning the abstract data of text into audible art.

It's still very much a work in progress, but I'm excited about its potential!

## Getting Started 🚀

To run Wavify and create your own audio files:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/iamharshdabas/wavify
   cd wavify
   ```

2. **Install Dependencies:**

   ```bash
   bun install
   ```

3. **Prepare Your Input:**
   You can directly edit the `inputString` variable within the `main` function in
   `src/index.ts`. Currently, this is the only method for providing input.

   ```javascript
   const inputString = "Hello Wavify";
   ```

4. **Run the Generator:**

   ```bash
   bun start
   ```

## Sample Audio 🎧

After running the generator, you will find a file named
`generated_music_from_text.wav` in your project directory.

To play this sample:

- **On your computer:** Simply open the `generated_music_from_text.wav` file
  with any media player mpv, vlc etc.
- **Command Line (if you have `mpv` installed):**

  ```bash
  mpv generated_music_from_text.wav
  ```

## Work in Progress 🚧

Wavify is under active development. Expect more features, refinements, and
possibly new musical styles in the future! Your feedback and contributions are welcome.
