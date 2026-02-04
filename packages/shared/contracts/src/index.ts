import { z } from "zod";

/**
 * Request schema for the evaluate endpoint
 */
export const EvaluateRequestSchema = z.object({
  expression: z
    .string()
    .min(1, "Expression cannot be empty")
    .max(1000, "Expression too long (max 1000 characters)"),
});

export type EvaluateRequest = z.infer<typeof EvaluateRequestSchema>;

/**
 * Successful evaluation response
 */
export const EvaluateSuccessSchema = z.object({
  ok: z.literal(true),
  result: z.string(),
  normalized: z.string(),
});

export type EvaluateSuccess = z.infer<typeof EvaluateSuccessSchema>;

/**
 * Error details schema
 */
export const CalculatorErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  position: z.number().optional(),
});

export type CalculatorErrorDetail = z.infer<typeof CalculatorErrorDetailSchema>;

/**
 * Error evaluation response
 */
export const EvaluateErrorSchema = z.object({
  ok: z.literal(false),
  error: CalculatorErrorDetailSchema,
});

export type EvaluateError = z.infer<typeof EvaluateErrorSchema>;

/**
 * Combined response schema (union of success and error)
 */
export const EvaluateResponseSchema = z.discriminatedUnion("ok", [
  EvaluateSuccessSchema,
  EvaluateErrorSchema,
]);

export type EvaluateResponse = z.infer<typeof EvaluateResponseSchema>;

/**
 * Health check response
 */
export const HealthResponseSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  timestamp: z.string().datetime(),
  version: z.string().optional(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/**
 * Error codes used throughout the API
 */
export const ErrorCodes = {
  SYNTAX_ERROR: "SYNTAX_ERROR",
  DIVISION_BY_ZERO: "DIVISION_BY_ZERO",
  EMPTY_EXPRESSION: "EMPTY_EXPRESSION",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * API endpoint paths
 */
export const ApiPaths = {
  evaluate: "/v1/evaluate",
  health: "/v1/health",
} as const;

/**
 * MCP tool names
 */
export const McpTools = {
  evaluate: "calculator.evaluate",
} as const;
