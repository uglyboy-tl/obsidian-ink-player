import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			obsidian: path.resolve(__dirname, "src/__mocks__/obsidian.ts"),
			view: path.resolve(__dirname, "src/view.ts"),
			settings: path.resolve(__dirname, "src/settings.ts"),
			patches: path.resolve(__dirname, "src/patches.ts"),
			"locales/i18n": path.resolve(__dirname, "src/locales/i18n.ts"),
		},
	},
});
