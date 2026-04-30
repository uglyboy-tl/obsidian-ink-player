import { describe, expect, it } from "bun:test";
import { resolve } from "../deps";

describe("pluginDependencies", () => {
  it("should enable memory when enabling auto-save", () => {
    const currentSettings = {
      audio: true,
      image: true,
      "link-open": false,
      memory: false,
      "auto-restore": false,
      "scroll-after-choice": true,
      "fade-effect": true,
      "cd-button": false,
      "auto-button": false,
      "auto-save": false,
    };

    const newSettings = resolve(currentSettings, "auto-save", true);

    expect(newSettings["auto-save"]).toBe(true);
    expect(newSettings.memory).toBe(true); // memory should be enabled as dependency
  });

  it("should disable auto-save and auto-restore when disabling memory", () => {
    const currentSettings = {
      audio: true,
      image: true,
      "link-open": false,
      memory: true,
      "auto-restore": true,
      "scroll-after-choice": true,
      "fade-effect": true,
      "cd-button": false,
      "auto-button": false,
      "auto-save": true,
    };

    const newSettings = resolve(currentSettings, "memory", false);

    expect(newSettings.memory).toBe(false);
    expect(newSettings["auto-save"]).toBe(false); // auto-save depends on memory
    expect(newSettings["auto-restore"]).toBe(false); // auto-restore depends on memory
  });

  it("should not affect unrelated plugins", () => {
    const currentSettings = {
      audio: true,
      image: true,
      "link-open": false,
      memory: true,
      "auto-restore": true,
      "scroll-after-choice": true,
      "fade-effect": true,
      "cd-button": false,
      "auto-button": false,
      "auto-save": true,
    };

    const newSettings = resolve(currentSettings, "audio", false);

    expect(newSettings.audio).toBe(false);
    // Other plugins should remain unchanged
    expect(newSettings.image).toBe(true);
    expect(newSettings.memory).toBe(true);
    expect(newSettings["auto-save"]).toBe(true);
  });
});
