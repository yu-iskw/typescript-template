import { tokenize } from "./tokenizer.js";

/**
 * Normalizes an expression by removing unnecessary whitespace
 * and standardizing the format.
 *
 * @param expression - The expression to normalize
 * @returns Normalized expression string
 */
export function normalize(expression: string): string {
  const tokens = tokenize(expression);

  // Remove EOF token and join values
  return tokens
    .filter((t) => t.type !== "EOF")
    .map((t) => t.value)
    .join("");
}
