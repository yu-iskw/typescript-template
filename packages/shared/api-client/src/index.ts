import {
  ApiPaths,
  EvaluateResponseSchema,
  HealthResponseSchema,
  type EvaluateRequest,
  type EvaluateResponse,
  type HealthResponse,
} from "@calculator/contracts";

/**
 * Configuration options for the calculator API client
 */
export interface CalculatorClientConfig {
  /** Base URL of the API (e.g., "http://localhost:3001") */
  baseUrl: string;
  /** Optional API key for authentication */
  apiKey?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Number of retry attempts for failed requests (default: 3) */
  retries?: number;
  /** Custom fetch implementation (for testing or environments without native fetch) */
  fetch?: typeof fetch;
}

/**
 * Error thrown when an API request fails
 */
export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Typed API client for the calculator backend
 */
export class CalculatorClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;
  private retries: number;
  private fetchFn: typeof fetch;

  constructor(config: CalculatorClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 10000;
    this.retries = config.retries ?? 3;
    this.fetchFn = config.fetch ?? fetch;
  }

  /**
   * Evaluate a mathematical expression
   */
  async evaluate(expression: string): Promise<EvaluateResponse> {
    const request: EvaluateRequest = { expression };

    const response = await this.request<EvaluateResponse>(
      ApiPaths.evaluate,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
      EvaluateResponseSchema.parse
    );

    return response;
  }

  /**
   * Check API health status
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>(
      ApiPaths.health,
      { method: "GET" },
      HealthResponseSchema.parse
    );
  }

  /**
   * Internal request method with retry logic
   */
  private async request<T>(
    path: string,
    init: RequestInit,
    parse: (data: unknown) => T
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await this.fetchFn(url, {
          ...init,
          headers: { ...headers, ...init.headers },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `API request failed: ${response.statusText}`,
            response.status
          );
        }

        const data: unknown = await response.json();
        return parse(data);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on client errors (4xx) except rate limiting
        if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }

        // Wait before retrying with exponential backoff
        if (attempt < this.retries - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError ?? new Error("Request failed after retries");
  }
}

/**
 * Create a new calculator client with the given configuration
 */
export function createCalculatorClient(
  config: CalculatorClientConfig
): CalculatorClient {
  return new CalculatorClient(config);
}

// Re-export types for convenience
export type {
  EvaluateRequest,
  EvaluateResponse,
  HealthResponse,
} from "@calculator/contracts";
