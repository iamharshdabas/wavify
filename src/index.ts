/**
 * Greets a person by name.
 * @param name The name of the person to greet.
 * @returns A greeting string.
 */
export function greet(name: string): string {
  if (!name) {
    throw new Error("Name cannot be empty.")
  }
  return `Hello, ${name}! Welcome to your Bun library.`
}

/**
 * Adds two numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The sum of the two numbers.
 */
export function add(a: number, b: number): number {
  return a + b
}
