#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { calculate } from "@calculator/engine";
import { McpTools } from "@calculator/contracts";

// Create MCP server
const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
});

// Register the calculator.evaluate tool
server.tool(
  McpTools.evaluate,
  "Evaluate a mathematical expression. Supports basic arithmetic operations (+, -, *, /), parentheses, and decimal numbers.",
  {
    expression: z
      .string()
      .describe("The mathematical expression to evaluate (e.g., '(1 + 2) * 3')"),
  },
  async ({ expression }) => {
    const result = calculate(expression);

    if (result.ok) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                result: result.result,
                normalized: result.normalized,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${result.error.message}${result.error.position !== undefined ? ` at position ${result.error.position}` : ""}`,
        },
      ],
      isError: true,
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Calculator MCP server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
