import { afterAll, describe, expect, it } from "bun:test";
import { Plugins } from "@inkweave/core";
import { plugins } from "../plugins";

for (const p of plugins) {
  Plugins.register(p);
}

afterAll(() => {
  // TODO: replace with Plugins.reset() once @inkweave/core exposes a public reset method
  // biome-ignore lint/suspicious/noExplicitAny: test cleanup, same as core/Plugins.test.ts
  (Plugins as any)._plugins.clear();
});

describe("pluginDependencies", () => {
  it("should enable memory when enabling auto-save", () => {
    const result = Plugins.resolveDependencies({ "auto-save": true });

    expect(result["auto-save"]).toBe(true);
    expect(result.memory).toBe(true);
  });

  it("should disable auto-save and auto-restore when disabling memory", () => {
    const result = Plugins.resolveDependencies({ memory: false });

    expect(result.memory).toBe(false);
    expect(result["auto-save"]).toBe(false);
    expect(result["auto-restore"]).toBe(false);
  });

  it("should not affect unrelated plugins", () => {
    const result = Plugins.resolveDependencies({ audio: false });

    expect(result.audio).toBe(false);
    expect(result).not.toHaveProperty("image");
    expect(result).not.toHaveProperty("memory");
    expect(result).not.toHaveProperty("auto-save");
  });

  it("should toggle class-tag independently (no deps)", () => {
    const result = Plugins.resolveDependencies({ "class-tag": false });

    expect(result["class-tag"]).toBe(false);
    expect(result).not.toHaveProperty("audio");
    expect(result).not.toHaveProperty("memory");
  });
});
