import { ChoiceParser, ExternalFunctions, Parser, Patches, Tags } from "@inkweave/core";
import {
  loadAudio,
  loadAutoButton,
  loadAutosave,
  loadCdButton,
  loadFadeEffect,
  loadImage,
  loadLinkopen,
  loadMemory,
  loadScrollafterchoice,
} from "@inkweave/plugins";
import type { PluginSettings } from "settings";

const PLUGIN_LOADER: Record<keyof PluginSettings, () => void> = {
  audio: loadAudio,
  image: loadImage,
  linkopen: loadLinkopen,
  memory: loadMemory,
  scrollafterchoice: loadScrollafterchoice,
  fadeforline: loadFadeEffect,
  cd_button: loadCdButton,
  auto_button: loadAutoButton,
  auto_save: loadAutosave,
};

export const applySettings = (settings: PluginSettings) => {
  // 1. 清理插件
  Patches.patches = [];
  Tags.clear();
  ChoiceParser.clear();
  Parser.clear();
  ExternalFunctions.functions = new Map();

  // 2. 加载新启用的插件
  (Object.entries(settings) as [keyof PluginSettings, boolean][])
    .filter(([, enabled]) => enabled)
    .forEach(([key]) => {
      if (PLUGIN_LOADER[key]) {
        PLUGIN_LOADER[key]();
      }
    });
};
