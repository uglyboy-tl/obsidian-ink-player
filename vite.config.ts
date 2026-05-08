import { builtinModules } from "node:module";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig(({ mode }) => ({
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode || "production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["cjs"],
      fileName: () => "main.js",
    },
    rollupOptions: {
      external: [
        "obsidian",
        "electron",
        /^@codemirror\//,
        /^@lezer\//,
        ...builtinModules,
      ],
      output: {
        exports: "default",
        assetFileNames: "styles.css",
      },
    },
    target: "es2018",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: "esbuild",
    emptyOutDir: true,
  },
  plugins: [solid()],
}));
