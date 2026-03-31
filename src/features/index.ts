import type InkWeavePlugin from "../plugin";
import type { Settings } from "../settings";
import autoRestore from "./autoRestore";

export interface Feature {
  id: keyof Settings;
  setup: (plugin: InkWeavePlugin, settings: Settings) => void;
  update?: (settings: Settings) => void;
  cleanup?: () => void;
}

export const features: Feature[] = [autoRestore];

export const getFeatureTitleKey = (id: string) => `settings_${id}_title` as const;
export const getFeatureDescKey = (id: string) => `settings_${id}_desc` as const;
