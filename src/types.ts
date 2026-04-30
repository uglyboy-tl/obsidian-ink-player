export interface PluginSettings {
  audio: boolean;
  image: boolean;
  "link-open": boolean;
  memory: boolean;
  "auto-restore": boolean;
  "scroll-after-choice": boolean;
  "fade-effect": boolean;
  "cd-button": boolean;
  "auto-button": boolean;
  "auto-save": boolean;
}

export interface Settings extends PluginSettings {
  linedelay: number;
  debug: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  audio: true,
  image: true,
  "link-open": false,
  memory: true,
  "auto-restore": true,
  "scroll-after-choice": true,
  "fade-effect": true,
  "cd-button": false,
  "auto-button": false,
  "auto-save": false,
  linedelay: 0.1,
  debug: false,
};
