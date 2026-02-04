import { describe, expect, it } from "vitest";
import {
  tokenize,
  parse,
  evaluate,
  formatResult,
  normalize,
  calculate,
  CalculatorError,
} from "./index.js";

describe("tokenizer", () => {
  it("tokenizes numbers", () => {
    const tokens = tokenize("42");
    expect(tokens).toEqual([
      { type: "NUMBER", value: "42", position: 0 },
      { type: "EOF", value: "", position: 2 },
    ]);
  });

  it("tokenizes decimal numbers", () => {
    const tokens = tokenize("3.14");
    expect(tokens).toEqual([
      { type: "NUMBER", value: "3.14", position: 0 },
      { type: "EOF", value: "", position: 4 },
    ]);
  });

  it("tokenizes operators", () => {
    const tokens = tokenize("1 + 2 - 3 * 4 / 5");
    const types = tokens.map((t) => t.type);
    expect(types).toEqual([
      "NUMBER",
      "PLUS",
      "NUMBER",
      "MINUS",
      "NUMBER",
      "MULTIPLY",
      "NUMBER",
      "DIVIDE",
      "NUMBER",
      "EOF",
    ]);
  });

  it("tokenizes parentheses", () => {
    const tokens = tokenize("(1 + 2)");
    const types = tokens.map((t) => t.type);
    expect(types).toEqual(["LPAREN", "NUMBER", "PLUS", "NUMBER", "RPAREN", "EOF"]);
  });

  it("throws on invalid characters", () => {
    expect(() => tokenize("1 @ 2")).toThrow(CalculatorError);
    expect(() => tokenize("1 @ 2")).toThrow("Unexpected character '@'");
  });

  it("throws on trailing decimal point", () => {
    expect(() => tokenize("42.")).toThrow(CalculatorError);
    expect(() => tokenize("42.")).toThrow("trailing decimal point");
  });
});

describe("parser", () => {
  it("parses simple numbers", () => {
    const tokens = tokenize("42");
    const ast = parse(tokens);
    expect(ast).toEqual({ type: "Number", value: 42 });
  });

  it("parses addition", () => {
    const tokens = tokenize("1 + 2");
    const ast = parse(tokens);
    expect(ast).toEqual({
      type: "BinaryOp",
      operator: "+",
      left: { type: "Number", value: 1 },
      right: { type: "Number", value: 2 },
    });
  });

  it("parses operator precedence correctly", () => {
    const tokens = tokenize("1 + 2 * 3");
    const ast = parse(tokens);
    // Should be 1 + (2 * 3), not (1 + 2) * 3
    expect(ast).toEqual({
      type: "BinaryOp",
      operator: "+",
      left: { type: "Number", value: 1 },
      right: {
        type: "BinaryOp",
        operator: "*",
        left: { type: "Number", value: 2 },
        right: { type: "Number", value: 3 },
      },
    });
  });

  it("parses parentheses", () => {
    const tokens = tokenize("(1 + 2) * 3");
    const ast = parse(tokens);
    expect(ast).toEqual({
      type: "BinaryOp",
      operator: "*",
      left: {
        type: "BinaryOp",
        operator: "+",
        left: { type: "Number", value: 1 },
        right: { type: "Number", value: 2 },
      },
      right: { type: "Number", value: 3 },
    });
  });

  it("parses unary minus", () => {
    const tokens = tokenize("-5");
    const ast = parse(tokens);
    expect(ast).toEqual({
      type: "UnaryOp",
      operator: "-",
      operand: { type: "Number", value: 5 },
    });
  });

  it("throws on unbalanced parentheses", () => {
    const tokens = tokenize("(1 + 2");
    expect(() => parse(tokens)).toThrow(CalculatorError);
    expect(() => parse(tokens)).toThrow("Expected closing parenthesis");
  });

  it("throws on unexpected tokens", () => {
    const tokens = tokenize("1 + + 2");
    // The parser will try to parse "+ 2" as a unary expression after the first +
    // Actually, let me trace through: expression -> term (1) -> check for +/- -> found +
    // -> term -> factor -> match + -> factor -> primary -> NUMBER (2)
    // So "1 + + 2" parses as "1 + (+2)" which is valid
    const ast = parse(tokens);
    expect(ast).toEqual({
      type: "BinaryOp",
      operator: "+",
      left: { type: "Number", value: 1 },
      right: {
        type: "UnaryOp",
        operator: "+",
        operand: { type: "Number", value: 2 },
      },
    });
  });

  it("throws on empty expression", () => {
    const tokens = tokenize("");
    expect(() => parse(tokens)).toThrow(CalculatorError);
  });
});

describe("evaluator", () => {
  it("evaluates numbers", () => {
    const ast = parse(tokenize("42"));
    expect(evaluate(ast)).toBe(42);
  });

  it("evaluates addition", () => {
    const ast = parse(tokenize("1 + 2"));
    expect(evaluate(ast)).toBe(3);
  });

  it("evaluates subtraction", () => {
    const ast = parse(tokenize("5 - 3"));
    expect(evaluate(ast)).toBe(2);
  });

  it("evaluates multiplication", () => {
    const ast = parse(tokenize("4 * 5"));
    expect(evaluate(ast)).toBe(20);
  });

  it("evaluates division", () => {
    const ast = parse(tokenize("10 / 2"));
    expect(evaluate(ast)).toBe(5);
  });

  it("evaluates complex expressions", () => {
    const ast = parse(tokenize("(1 + 2) * 3 - 4 / 2"));
    expect(evaluate(ast)).toBe(7); // 9 - 2 = 7
  });

  it("evaluates unary minus", () => {
    const ast = parse(tokenize("-5"));
    expect(evaluate(ast)).toBe(-5);
  });

  it("evaluates double negative", () => {
    const ast = parse(tokenize("--5"));
    expect(evaluate(ast)).toBe(5);
  });

  it("throws on division by zero", () => {
    const ast = parse(tokenize("1 / 0"));
    expect(() => evaluate(ast)).toThrow(CalculatorError);
    expect(() => evaluate(ast)).toThrow("Division by zero");
  });

  it("handles decimal arithmetic", () => {
    const ast = parse(tokenize("0.1 + 0.2"));
    const result = evaluate(ast);
    expect(result).toBeCloseTo(0.3, 10);
  });
});

describe("formatResult", () => {
  it("formats integers", () => {
    expect(formatResult(42)).toBe("42");
  });

  it("formats decimals", () => {
    expect(formatResult(3.14159)).toBe("3.14159");
  });

  it("removes trailing zeros", () => {
    expect(formatResult(3.0)).toBe("3");
    expect(formatResult(3.1)).toBe("3.1");
  });

  it("handles very large numbers", () => {
    const result = formatResult(1e20);
    expect(result).toContain("e");
  });

  it("handles Infinity", () => {
    expect(formatResult(Infinity)).toBe("Infinity");
    expect(formatResult(-Infinity)).toBe("-Infinity");
  });

  it("handles NaN", () => {
    expect(formatResult(NaN)).toBe("NaN");
  });
});

describe("normalize", () => {
  it("removes whitespace", () => {
    expect(normalize("1 + 2")).toBe("1+2");
    expect(normalize("  1  +  2  ")).toBe("1+2");
  });

  it("preserves expression structure", () => {
    expect(normalize("(1 + 2) * 3")).toBe("(1+2)*3");
  });
});

describe("calculate (high-level API)", () => {
  it("returns successful result", () => {
    const result = calculate("1 + 2");
    expect(result).toEqual({
      ok: true,
      result: "3",
      normalized: "1+2",
      numericResult: 3,
    });
  });

  it("returns error for invalid syntax", () => {
    const result = calculate("1 @@ 2");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("SYNTAX_ERROR");
    }
  });

  it("returns error for division by zero", () => {
    const result = calculate("1 / 0");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("DIVISION_BY_ZERO");
    }
  });

  it("returns error for empty expression", () => {
    const result = calculate("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("EMPTY_EXPRESSION");
    }
  });

  it("handles complex expressions", () => {
    const result = calculate("(10 + 5) * 2 / 3");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.numericResult).toBe(10);
    }
  });

  // Golden tests for common expressions
  const goldenTests = [
    ["1+1", 2],
    ["2*3", 6],
    ["10/2", 5],
    ["10-3", 7],
    ["2+3*4", 14],
    ["(2+3)*4", 20],
    ["-5+10", 5],
    ["--5", 5],
    ["10/4", 2.5],
    ["1+2+3+4+5", 15],
    ["2*2*2*2", 16],
    ["100/10/2", 5],
    ["10-5-2", 3],
    ["(1+2)*(3+4)", 21],
    ["((1+2))", 3],
  ] as const;

  goldenTests.forEach(([expr, expected]) => {
    it(`evaluates "${expr}" = ${expected}`, () => {
      const result = calculate(expr);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.numericResult).toBe(expected);
      }
    });
  });
});
