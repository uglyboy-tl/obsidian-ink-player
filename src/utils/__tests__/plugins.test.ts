import { afterAll, describe, expect, it } from "bun:test";
import { PluginRegistry } from "@inkweave/core";
import { plugins } from "../plugins";

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
