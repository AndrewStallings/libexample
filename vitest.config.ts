import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@/book-pages": path.resolve(__dirname, "./src/app/book-pages"),
      "@/books": path.resolve(__dirname, "./src/app/books"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/drop-box-locations": path.resolve(__dirname, "./src/app/drop-box-locations"),
      "@/snacks": path.resolve(__dirname, "./src/app/snacks"),
      "@/reviews": path.resolve(__dirname, "./src/app/reviews"),
      "@/sales": path.resolve(__dirname, "./src/app/sales"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/testing": path.resolve(__dirname, "./src/testing"),
      "our-lib": path.resolve(__dirname, "./packages/our-lib/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/app/**/*.test.ts", "src/app/**/*.test.tsx", "packages/**/*.test.ts", "packages/**/*.test.tsx"],
  },
});
