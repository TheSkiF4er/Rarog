import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@rarog/js": path.resolve(__dirname, "packages/js/src/rarog.esm.js")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/setup/jsdom.js"],
    include: ["tests/js/**/*.test.js", "tests/adapters/**/*.test.js"]
  }
});
