import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Test harness for the agent pipeline (test-first development).
 * - jsdom so component/DOM tests work; pure-function tests run fine here too.
 * - `@/*` alias mirrors tsconfig so tests can import like the app does.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // The app's own e2e/build outputs are not unit tests.
    exclude: ["node_modules", ".next", "dist"],
  },
});
