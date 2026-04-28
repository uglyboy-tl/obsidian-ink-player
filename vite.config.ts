import { builtinModules } from "node:module";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const processPolyfill = `if(typeof window!=="undefined"&&typeof window.process==="undefined"){window.process={env:{NODE_ENV:"production"},browser:true}}`;

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["cjs"],
      fileName: () => "main.js",
    },
    rollupOptions: {
      external: [
        // Obsidian
        "obsidian",
        "electron",
        // CodeMirror
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        // Node builtins
        ...builtinModules,
      ],
      output: {
        banner: processPolyfill,
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
  plugins: [
    react(),
  ],
});
