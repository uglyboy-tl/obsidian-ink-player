export interface Settings {
  audio: boolean;
  image: boolean;
  linkopen: boolean;
  memory: boolean;
  auto_restore: boolean;
  scrollafterchoice: boolean;
  fadeforline: boolean;
  cd_button: boolean;
  auto_button: boolean;
  auto_save: boolean;
  linedelay: number;
  debug: boolean;
}

export type PluginSettings = Pick<
  Settings,
  | "audio"
  | "image"
  | "linkopen"
  | "memory"
  | "auto_restore"
  | "scrollafterchoice"
  | "fadeforline"
  | "cd_button"
  | "auto_button"
  | "auto_save"
>;

export const DEFAULT_SETTINGS: Settings = {
  audio: true,
  image: true,
  linkopen: false,
  memory: true,
  auto_restore: true,
  scrollafterchoice: true,
  fadeforline: true,
  cd_button: false,
  auto_button: false,
  auto_save: false,
  linedelay: 0.1,
  debug: false,
};
