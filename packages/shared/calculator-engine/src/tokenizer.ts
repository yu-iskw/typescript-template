import { CalculatorError, type Token, type TokenType } from "./types.js";

/**
 * Tokenizes a mathematical expression into a sequence of tokens.
 *
 * @param expression - The expression string to tokenize
 * @returns An array of tokens
 * @throws CalculatorError if an invalid character is encountered
 */
export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;

  while (position < expression.length) {
    const char = expression[position]!;

    // Skip whitespace
    if (/\s/.test(char)) {
      position++;
      continue;
    }

    // Numbers (including decimals)
    if (/\d/.test(char) || (char === "." && /\d/.test(expression[position + 1] ?? ""))) {
      const start = position;
      let value = "";
      let hasDecimal = false;

      while (position < expression.length) {
        const c = expression[position]!;
        if (/\d/.test(c)) {
          value += c;
          position++;
        } else if (c === "." && !hasDecimal) {
          hasDecimal = true;
          value += c;
          position++;
        } else {
          break;
        }
      }

      // Validate number format
      if (value.endsWith(".")) {
        throw new CalculatorError(
          "SYNTAX_ERROR",
          "Invalid number format: trailing decimal point",
          start
        );
      }

      tokens.push({ type: "NUMBER", value, position: start });
      continue;
    }

    // Single-character tokens
    const singleCharTokens: Record<string, TokenType> = {
      "+": "PLUS",
      "-": "MINUS",
      "*": "MULTIPLY",
      "/": "DIVIDE",
      "(": "LPAREN",
      ")": "RPAREN",
    };

    const tokenType = singleCharTokens[char];
    if (tokenType) {
      tokens.push({ type: tokenType, value: char, position });
      position++;
      continue;
    }

    // Unknown character
    throw new CalculatorError(
      "SYNTAX_ERROR",
      `Unexpected character '${char}'`,
      position
    );
  }

  tokens.push({ type: "EOF", value: "", position });
  return tokens;
}
