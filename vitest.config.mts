import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    reporters: ["default", "junit"],
    outputFile: "./junit.xml",
  },
});
