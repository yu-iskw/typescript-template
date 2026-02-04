import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/shared/*/src/**/*.{test,spec}.ts",
      "packages/backend/*/src/**/*.{test,spec}.ts",
    ],
    exclude: ["node_modules", ".trunk", "**/dist/**"],
  },
});
