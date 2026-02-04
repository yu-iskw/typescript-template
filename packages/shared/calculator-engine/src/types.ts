/**
 * Token types for the calculator expression tokenizer
 */
export type TokenType =
  | "NUMBER"
  | "PLUS"
  | "MINUS"
  | "MULTIPLY"
  | "DIVIDE"
  | "LPAREN"
  | "RPAREN"
  | "EOF";

/**
 * A token produced by the tokenizer
 */
export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

/**
 * AST node types
 */
export type ASTNodeType = "Number" | "BinaryOp" | "UnaryOp";

/**
 * Base AST node
 */
export interface BaseASTNode {
  type: ASTNodeType;
}

/**
 * Number literal node
 */
export interface NumberNode extends BaseASTNode {
  type: "Number";
  value: number;
}

/**
 * Binary operation node (e.g., 1 + 2)
 */
export interface BinaryOpNode extends BaseASTNode {
  type: "BinaryOp";
  operator: "+" | "-" | "*" | "/";
  left: ASTNode;
  right: ASTNode;
}

/**
 * Unary operation node (e.g., -5)
 */
export interface UnaryOpNode extends BaseASTNode {
  type: "UnaryOp";
  operator: "+" | "-";
  operand: ASTNode;
}

/**
 * Union type for all AST nodes
 */
export type ASTNode = NumberNode | BinaryOpNode | UnaryOpNode;

/**
 * Calculator error with position information
 */
export class CalculatorError extends Error {
  code: string;
  position?: number;

  constructor(code: string, message: string, position?: number) {
    super(message);
    this.name = "CalculatorError";
    this.code = code;
    this.position = position;
  }
}
