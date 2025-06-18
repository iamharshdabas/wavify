import { describe, expect, it } from "bun:test"
import { add, greet } from "../src/index"

describe("greet", () => {
  it("should return a greeting with the given name", () => {
    expect(greet("Alice")).toBe("Hello, Alice! Welcome to your Bun library.")
  })

  it("should throw an error if name is empty", () => {
    expect(() => greet("")).toThrow("Name cannot be empty.")
  })

  it("should throw an error if name is null or undefined", () => {
    // @ts-ignore - Intentionally testing invalid input
    expect(() => greet(null)).toThrow("Name cannot be empty.")
    // @ts-ignore - Intentionally testing invalid input
    expect(() => greet(undefined)).toThrow("Name cannot be empty.")
  })
})

describe("add", () => {
  it("should correctly add two positive numbers", () => {
    expect(add(2, 3)).toBe(5)
  })

  it("should correctly add a positive and a negative number", () => {
    expect(add(5, -2)).toBe(3)
  })

  it("should correctly add two negative numbers", () => {
    expect(add(-5, -2)).toBe(-7)
  })

  it("should handle zero correctly", () => {
    expect(add(0, 10)).toBe(10)
    expect(add(10, 0)).toBe(10)
    expect(add(0, 0)).toBe(0)
  })
})
