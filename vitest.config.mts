import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    // Use include and exclude patterns instead of environmentMatchGlobs
    include: ["**/src/**/*.test.{ts,tsx}", "**/convex/**/*.test.ts"],
    environment: "jsdom", // Default environment
    environmentOptions: {
      // Override environment for specific patterns
      "edge-runtime": {
        include: ["**/convex/**/*.test.ts"],
      },
    },
    server: { deps: { inline: ["convex-test"] } },
    reporters: ["default", "junit"],
    outputFile: "./junit.xml",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
