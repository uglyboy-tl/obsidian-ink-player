import { type App, PluginSettingTab, Setting } from "obsidian";
import type { TransItemType } from "./locales/i18n";
import type InkWeavePlugin from "./main";
import type { PluginSettings, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export class SettingsTab extends PluginSettingTab {
  plugin: InkWeavePlugin;

  constructor(app: App, plugin: InkWeavePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  t(x: TransItemType, vars?: Record<string, string>) {
    return this.plugin.i18n.t(x, vars);
  }

  private addPluginToggle(
    key: keyof PluginSettings,
    titleKey: TransItemType,
    descKey: TransItemType,
  ) {
    new Setting(this.containerEl)
      .setName(this.t(titleKey))
      .setDesc(this.t(descKey))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings[key])
          .onChange(
            async (value) =>
              await this.plugin.updateSettings({ [key]: value } as Partial<Settings>),
          ),
      );
  }

  display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl).setName(this.t("settings_options")).setHeading();

    new Setting(this.containerEl)
      .setName(this.t("options_linedelay_title"))
      .setDesc(this.t("options_linedelay_desc"))
      .addSlider((slider) => {
        slider
          .setLimits(0, 1, 0.05)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.linedelay ?? DEFAULT_SETTINGS.linedelay)
          .onChange(async (val) => {
            await this.plugin.updateSettings({
              linedelay: val,
            });
          });
      });

    new Setting(this.containerEl).setName(this.t("settings_plugins")).setHeading();

    // Fixed plugin settings
    this.addPluginToggle("audio", "settings_audio_title", "settings_audio_desc");
    this.addPluginToggle("image", "settings_image_title", "settings_image_desc");
    this.addPluginToggle("linkopen", "settings_linkopen_title", "settings_linkopen_desc");
    this.addPluginToggle("memory", "settings_memory_title", "settings_memory_desc");
    this.addPluginToggle(
      "auto_restore",
      "settings_auto_restore_title",
      "settings_auto_restore_desc",
    );
    this.addPluginToggle(
      "scrollafterchoice",
      "settings_scrollafterchoice_title",
      "settings_scrollafterchoice_desc",
    );
    this.addPluginToggle("fadeforline", "settings_fadeforline_title", "settings_fadeforline_desc");
    this.addPluginToggle("cd_button", "settings_cdbutton_title", "settings_cdbutton_desc");
    this.addPluginToggle("auto_button", "settings_autobutton_title", "settings_autobutton_desc");
    this.addPluginToggle("auto_save", "settings_autosave_title", "settings_autosave_desc");
  }
}
