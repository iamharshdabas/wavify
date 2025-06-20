import { describe, expect, it } from "bun:test"
import { generateNotes, Note } from "../src/index"

describe("generateNotes", () => {
  it("should generate correct notes for a Python code snippet", () => {
    const input = "def add(a, b): return a + b"
    const notes = generateNotes(input)

    expect(notes.length).toBe(7)
    expect(notes[0]).toEqual({
      midiNoteNumber: 36,
      startTimeMs: 0,
      durationMs: 3000,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.8 },
        { timeOffsetMs: 1000, volume: 0.2 },
        { timeOffsetMs: 2000, volume: 0.8 },
      ],
    })
    expect(notes[1]).toEqual({
      midiNoteNumber: 70,
      startTimeMs: 3000,
      durationMs: 1500,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.2 },
        { timeOffsetMs: 250, volume: 0.8 },
        { timeOffsetMs: 500, volume: 0.8 },
        { timeOffsetMs: 750, volume: 0.8 },
        { timeOffsetMs: 1000, volume: 0.2 },
        { timeOffsetMs: 1250, volume: 0.8 },
      ],
    })
    expect(notes[2]).toEqual({
      midiNoteNumber: 89,
      startTimeMs: 3000 + 1500,
      durationMs: 375,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.8 },
        { timeOffsetMs: 125, volume: 0.8 },
        { timeOffsetMs: 250, volume: 0.8 },
      ],
    })
    expect(notes[3]).toEqual({
      midiNoteNumber: 43,
      startTimeMs: 4500 + 375,
      durationMs: 6000,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.8 },
        { timeOffsetMs: 1000, volume: 0.2 },
        { timeOffsetMs: 2000, volume: 0.8 },
        { timeOffsetMs: 3000, volume: 0.2 },
        { timeOffsetMs: 4000, volume: 0.8 },
        { timeOffsetMs: 5000, volume: 0.8 },
      ],
    })
    expect(notes[4]).toEqual({
      midiNoteNumber: 60,
      startTimeMs: 4875 + 6000,
      durationMs: 250,
      volumeAutomation: [{ timeOffsetMs: 0, volume: 0.2 }],
    })
    expect(notes[5]).toEqual({
      midiNoteNumber: 87,
      startTimeMs: 10875 + 250,
      durationMs: 125,
      volumeAutomation: [{ timeOffsetMs: 0, volume: 0.8 }],
    })
    expect(notes[6]).toEqual({
      midiNoteNumber: 39,
      startTimeMs: 11125 + 125,
      durationMs: 1000,
      volumeAutomation: [{ timeOffsetMs: 0, volume: 0.8 }],
    })
  })

  it("should generate correct notes for a JavaScript code snippet", () => {
    const input = "const x = 10;"
    const notes = generateNotes(input)

    expect(notes.length).toBe(4)
    expect(notes[0]).toEqual({
      midiNoteNumber: 36,
      startTimeMs: 0,
      durationMs: 5000,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.2 },
        { timeOffsetMs: 1000, volume: 0.2 },
        { timeOffsetMs: 2000, volume: 0.8 },
        { timeOffsetMs: 3000, volume: 0.2 },
        { timeOffsetMs: 4000, volume: 0.8 },
      ],
    })
    expect(notes[1]).toEqual({
      midiNoteNumber: 63,
      startTimeMs: 5000,
      durationMs: 250,
      volumeAutomation: [{ timeOffsetMs: 0, volume: 0.8 }],
    })
    expect(notes[2]).toEqual({
      midiNoteNumber: 87,
      startTimeMs: 5000 + 250,
      durationMs: 125,
      volumeAutomation: [{ timeOffsetMs: 0, volume: 0.8 }],
    })
    expect(notes[3]).toEqual({
      midiNoteNumber: 41,
      startTimeMs: 5250 + 125,
      durationMs: 3000,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.8 },
        { timeOffsetMs: 1000, volume: 0.8 },
        { timeOffsetMs: 2000, volume: 0.8 },
      ],
    })
  })

  it("should generate correct notes for an HTML snippet", () => {
    const input = "<p>Hello</p>"
    const notes = generateNotes(input)

    expect(notes.length).toBe(1)
    expect(notes[0]).toEqual({
      midiNoteNumber: 39,
      startTimeMs: 0,
      durationMs: 12000,
      volumeAutomation: [
        { timeOffsetMs: 0, volume: 0.8 },
        { timeOffsetMs: 1000, volume: 0.8 },
        { timeOffsetMs: 2000, volume: 0.8 },
        { timeOffsetMs: 3000, volume: 0.8 },
        { timeOffsetMs: 4000, volume: 0.2 },
        { timeOffsetMs: 5000, volume: 0.8 },
        { timeOffsetMs: 6000, volume: 0.8 },
        { timeOffsetMs: 7000, volume: 0.2 },
        { timeOffsetMs: 8000, volume: 0.8 },
        { timeOffsetMs: 9000, volume: 0.8 },
        { timeOffsetMs: 10000, volume: 0.8 },
        { timeOffsetMs: 11000, volume: 0.8 },
      ],
    })
  })

  it("should throw an error for an empty string input", () => {
    expect(() => generateNotes("")).toThrow("Input must be a non-empty string")
  })

  it("should throw an error for null or undefined input", () => {
    expect(() => generateNotes(null)).toThrow("Input must be a non-empty string")

    expect(() => generateNotes(undefined)).toThrow("Input must be a non-empty string")
  })

  it("should throw an error for non-string input", () => {
    expect(() => generateNotes(123)).toThrow("Input must be a non-empty string")
    expect(() => generateNotes([])).toThrow("Input must be a non-empty string")
    expect(() => generateNotes({})).toThrow("Input must be a non-empty string")
  })
})
