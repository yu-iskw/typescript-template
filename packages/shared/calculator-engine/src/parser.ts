import {
  CalculatorError,
  type ASTNode,
  type BinaryOpNode,
  type NumberNode,
  type Token,
  type UnaryOpNode,
} from "./types.js";

/**
 * Parser class that builds an AST from tokens.
 *
 * Grammar (in order of precedence, lowest to highest):
 *   expression  -> term (('+' | '-') term)*
 *   term        -> factor (('*' | '/') factor)*
 *   factor      -> unary | primary
 *   unary       -> ('+' | '-') unary | primary
 *   primary     -> NUMBER | '(' expression ')'
 */
class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode {
    const ast = this.expression();

    if (!this.isAtEnd()) {
      const token = this.peek();
      throw new CalculatorError(
        "SYNTAX_ERROR",
        `Unexpected token '${token.value}'`,
        token.position
      );
    }

    return ast;
  }

  private expression(): ASTNode {
    let left = this.term();

    while (this.match("PLUS", "MINUS")) {
      const operator = this.previous().value as "+" | "-";
      const right = this.term();
      left = {
        type: "BinaryOp",
        operator,
        left,
        right,
      } satisfies BinaryOpNode;
    }

    return left;
  }

  private term(): ASTNode {
    let left = this.factor();

    while (this.match("MULTIPLY", "DIVIDE")) {
      const operator = this.previous().value as "*" | "/";
      const right = this.factor();
      left = {
        type: "BinaryOp",
        operator,
        left,
        right,
      } satisfies BinaryOpNode;
    }

    return left;
  }

  private factor(): ASTNode {
    // Handle unary operators
    if (this.match("PLUS", "MINUS")) {
      const operator = this.previous().value as "+" | "-";
      const operand = this.factor();
      return {
        type: "UnaryOp",
        operator,
        operand,
      } satisfies UnaryOpNode;
    }

    return this.primary();
  }

  private primary(): ASTNode {
    // Number literal
    if (this.match("NUMBER")) {
      const token = this.previous();
      return {
        type: "Number",
        value: parseFloat(token.value),
      } satisfies NumberNode;
    }

    // Parenthesized expression
    if (this.match("LPAREN")) {
      const expr = this.expression();
      if (!this.match("RPAREN")) {
        const token = this.peek();
        throw new CalculatorError(
          "SYNTAX_ERROR",
          "Expected closing parenthesis ')'",
          token.position
        );
      }
      return expr;
    }

    // Error: unexpected token
    const token = this.peek();
    if (token.type === "EOF") {
      throw new CalculatorError(
        "SYNTAX_ERROR",
        "Unexpected end of expression",
        token.position
      );
    }
    throw new CalculatorError(
      "SYNTAX_ERROR",
      `Unexpected token '${token.value}'`,
      token.position
    );
  }

  private match(...types: Token["type"][]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: Token["type"]): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek(): Token {
    return this.tokens[this.current]!;
  }

  private previous(): Token {
    return this.tokens[this.current - 1]!;
  }
}

/**
 * Parses tokens into an Abstract Syntax Tree (AST).
 *
 * @param tokens - Array of tokens from the tokenizer
 * @returns The root AST node
 * @throws CalculatorError for syntax errors
 */
export function parse(tokens: Token[]): ASTNode {
  const parser = new Parser(tokens);
  return parser.parse();
}
