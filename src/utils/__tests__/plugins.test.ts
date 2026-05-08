import { afterAll, describe, expect, it } from "bun:test";
import type { Plugin } from "@inkweave/core";
import { PluginRegistry } from "@inkweave/core";

// Stub plugins matching the obsidian plugin list (no SolidJS imports needed)
const plugins: Plugin[] = [
  { id: "audio", name: "Audio", enabledByDefault: true, onLoad: () => {} },
  { id: "auto-button", name: "Auto Button", enabledByDefault: true, onLoad: () => {} },
  {
    id: "auto-restore",
    name: "Auto Restore",
    enabledByDefault: true,
    onLoad: () => {},
    dependencies: ["memory"],
  },
  {
    id: "auto-save",
    name: "Auto Save",
    enabledByDefault: true,
    onLoad: () => {},
    dependencies: ["memory"],
  },
  { id: "cd-button", name: "CD Button", enabledByDefault: true, onLoad: () => {} },
  { id: "class-tag", name: "Class Tag", enabledByDefault: true, onLoad: () => {} },
  { id: "fade-effect", name: "Fade Effect", enabledByDefault: true, onLoad: () => {} },
  { id: "image", name: "Image", enabledByDefault: true, onLoad: () => {} },
  { id: "link-open", name: "Link Open", enabledByDefault: true, onLoad: () => {} },
  { id: "memory", name: "Memory", enabledByDefault: true, onLoad: () => {} },
  {
    id: "scroll-after-choice",
    name: "Scroll After Choice",
    enabledByDefault: true,
    onLoad: () => {},
  },
];

for (const p of plugins) {
  PluginRegistry.register(p);
}

afterAll(() => {
  PluginRegistry.clear();
});

describe("pluginDependencies", () => {
  it("should enable memory when enabling auto-save", () => {
    const result = PluginRegistry.resolveDependencies({ "auto-save": true });

    expect(result["auto-save"]).toBe(true);
    expect(result.memory).toBe(true);
  });

  it("should disable auto-save and auto-restore when disabling memory", () => {
    const result = PluginRegistry.resolveDependencies({ memory: false });

    expect(result.memory).toBe(false);
    expect(result["auto-save"]).toBe(false);
    expect(result["auto-restore"]).toBe(false);
  });

  it("should not affect unrelated plugins", () => {
    const result = PluginRegistry.resolveDependencies({ audio: false });

    expect(result.audio).toBe(false);
    expect(result).not.toHaveProperty("image");
    expect(result).not.toHaveProperty("memory");
    expect(result).not.toHaveProperty("auto-save");
  });

  it("should toggle class-tag independently (no deps)", () => {
    const result = PluginRegistry.resolveDependencies({ "class-tag": false });

    expect(result["class-tag"]).toBe(false);
    expect(result).not.toHaveProperty("audio");
    expect(result).not.toHaveProperty("memory");
  });
});
