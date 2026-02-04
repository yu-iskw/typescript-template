export { tokenize } from "./tokenizer.js";
export { parse } from "./parser.js";
export { evaluate, formatResult } from "./evaluator.js";
export { normalize } from "./normalize.js";
export {
  CalculatorError,
  type Token,
  type TokenType,
  type ASTNode,
  type NumberNode,
  type BinaryOpNode,
  type UnaryOpNode,
} from "./types.js";

import { tokenize } from "./tokenizer.js";
import { parse } from "./parser.js";
import { evaluate, formatResult } from "./evaluator.js";
import { normalize } from "./normalize.js";
import { CalculatorError } from "./types.js";

/**
 * Result of a calculation
 */
export interface CalculateResult {
  ok: true;
  result: string;
  normalized: string;
  numericResult: number;
}

/**
 * Error result from a calculation
 */
export interface CalculateError {
  ok: false;
  error: {
    code: string;
    message: string;
    position?: number;
  };
}

/**
 * Union type for calculate return value
 */
export type CalculateResponse = CalculateResult | CalculateError;

/**
 * High-level function to evaluate an expression string.
 * Combines tokenize, parse, and evaluate into a single call.
 *
 * @param expression - The mathematical expression to evaluate
 * @returns A result object with either the result or an error
 */
export function calculate(expression: string): CalculateResponse {
  try {
    if (!expression.trim()) {
      return {
        ok: false,
        error: {
          code: "EMPTY_EXPRESSION",
          message: "Expression cannot be empty",
        },
      };
    }

    const tokens = tokenize(expression);
    const ast = parse(tokens);
    const numericResult = evaluate(ast);
    const result = formatResult(numericResult);
    const normalized = normalize(expression);

    return {
      ok: true,
      result,
      normalized,
      numericResult,
    };
  } catch (error) {
    if (error instanceof CalculatorError) {
      return {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          position: error.position,
        },
      };
    }

    return {
      ok: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
