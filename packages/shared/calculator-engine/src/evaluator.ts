import { CalculatorError, type ASTNode } from "./types.js";

/**
 * Evaluates an AST and returns the computed result.
 *
 * @param ast - The AST root node to evaluate
 * @returns The computed number result
 * @throws CalculatorError for runtime errors (e.g., division by zero)
 */
export function evaluate(ast: ASTNode): number {
  switch (ast.type) {
    case "Number":
      return ast.value;

    case "UnaryOp": {
      const operand = evaluate(ast.operand);
      return ast.operator === "-" ? -operand : operand;
    }

    case "BinaryOp": {
      const left = evaluate(ast.left);
      const right = evaluate(ast.right);

      switch (ast.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          if (right === 0) {
            throw new CalculatorError(
              "DIVISION_BY_ZERO",
              "Division by zero is not allowed"
            );
          }
          return left / right;
      }
    }
  }
}

/**
 * Formats a number result for display.
 * Handles floating-point precision issues and very large/small numbers.
 *
 * @param n - The number to format
 * @param precision - Maximum decimal places (default: 10)
 * @returns Formatted string representation
 */
export function formatResult(n: number, precision = 10): string {
  if (!Number.isFinite(n)) {
    if (Number.isNaN(n)) return "NaN";
    return n > 0 ? "Infinity" : "-Infinity";
  }

  // Handle very large or very small numbers with scientific notation
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) {
    return n.toExponential(precision);
  }

  // Round to specified precision to avoid floating-point artifacts
  const rounded = parseFloat(n.toFixed(precision));

  // Remove trailing zeros and unnecessary decimal point
  return String(rounded);
}
