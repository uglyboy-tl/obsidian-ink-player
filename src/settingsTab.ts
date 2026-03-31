import type { TransItemType } from "locales/i18n";
import { type App, PluginSettingTab, Setting } from "obsidian";
import { features, getFeatureDescKey, getFeatureTitleKey } from "./features";
import type InkWeavePlugin from "./plugin";
import { DEFAULT_SETTINGS } from "./settings";

export class SettingsTab extends PluginSettingTab {
  plugin: InkWeavePlugin;

  constructor(app: App, plugin: InkWeavePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  t(x: TransItemType, vars?: Record<string, string>) {
    return this.plugin.i18n.t(x, vars);
  }

  private renderFeatureSetting(feature: (typeof features)[number]) {
    const titleKey = getFeatureTitleKey(feature.id) as TransItemType;
    const descKey = getFeatureDescKey(feature.id) as TransItemType;
    const value = this.plugin.settings[feature.id] as boolean;
    const defaultValue = DEFAULT_SETTINGS[feature.id] as boolean;

    new Setting(this.containerEl)
      .setName(this.t(titleKey))
      .setDesc(this.t(descKey))
      .addToggle((toggle) =>
        toggle.setValue(value ?? defaultValue).onChange(
          async (newValue) =>
            await this.plugin.updateSettings({
              [feature.id]: newValue,
            } as any),
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
    new Setting(this.containerEl)
      .setName(this.t("settings_audio_title"))
      .setDesc(this.t("settings_audio_desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.audio)
          .onChange(async (value) => await this.plugin.updateSettings({ audio: value })),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_image_title"))
      .setDesc(this.t("settings_image_desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.image)
          .onChange(async (value) => await this.plugin.updateSettings({ image: value })),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_linkopen_title"))
      .setDesc(this.t("settings_linkopen_desc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.linkopen).onChange(
          async (value) =>
            await this.plugin.updateSettings({
              linkopen: value,
            }),
        ),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_memory_title"))
      .setDesc(this.t("settings_memory_desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.memory)
          .onChange(async (value) => await this.plugin.updateSettings({ memory: value })),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_scrollafterchoice_title"))
      .setDesc(this.t("settings_scrollafterchoice_desc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.scrollafterchoice).onChange(
          async (value) =>
            await this.plugin.updateSettings({
              scrollafterchoice: value,
            }),
        ),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_fadeforline_title"))
      .setDesc(this.t("settings_fadeforline_desc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.fadeforline).onChange(
          async (value) =>
            await this.plugin.updateSettings({
              fadeforline: value,
            }),
        ),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_cdbutton_title"))
      .setDesc(this.t("settings_cdbutton_desc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.cd_button).onChange(
          async (value) =>
            await this.plugin.updateSettings({
              cd_button: value,
            }),
        ),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_autobutton_title"))
      .setDesc(this.t("settings_autobutton_desc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.auto_button).onChange(
          async (value) =>
            await this.plugin.updateSettings({
              auto_button: value,
            }),
        ),
      );

    new Setting(this.containerEl)
      .setName(this.t("settings_autosave_title"))
      .setDesc(this.t("settings_autosave_desc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.auto_save).onChange(
          async (value) =>
            await this.plugin.updateSettings({
              auto_save: value,
            }),
        ),
      );

    // Dynamic feature settings
    features.forEach((feature) => {
      this.renderFeatureSetting(feature);
    });
  }
}
