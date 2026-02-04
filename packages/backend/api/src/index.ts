import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { calculate } from "@calculator/engine";
import {
  ApiPaths,
  EvaluateRequestSchema,
  type EvaluateResponse,
  type HealthResponse,
} from "@calculator/contracts";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:8081"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting state (simple in-memory implementation for POC)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || record.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Health check endpoint
app.get(ApiPaths.health, (c) => {
  const response: HealthResponse = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };
  return c.json(response);
});

// Evaluate endpoint
app.post(ApiPaths.evaluate, async (c) => {
  // Rate limiting
  const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    const response: EvaluateResponse = {
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    };
    return c.json(response, 429);
  }

  // Parse and validate request
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    const response: EvaluateResponse = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid JSON body",
      },
    };
    return c.json(response, 400);
  }

  const parseResult = EvaluateRequestSchema.safeParse(body);
  if (!parseResult.success) {
    const response: EvaluateResponse = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.errors[0]?.message ?? "Invalid request",
      },
    };
    return c.json(response, 400);
  }

  const { expression } = parseResult.data;

  // Evaluate expression
  const result = calculate(expression);

  if (result.ok) {
    const response: EvaluateResponse = {
      ok: true,
      result: result.result,
      normalized: result.normalized,
    };
    return c.json(response);
  }

  const response: EvaluateResponse = {
    ok: false,
    error: {
      code: result.error.code,
      message: result.error.message,
      position: result.error.position,
    },
  };
  return c.json(response, 400);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// Start server
const port = parseInt(process.env["PORT"] ?? "3001", 10);

console.log(`Starting calculator API server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Calculator API running at http://localhost:${port}`);
console.log(`  - POST ${ApiPaths.evaluate}`);
console.log(`  - GET  ${ApiPaths.health}`);
