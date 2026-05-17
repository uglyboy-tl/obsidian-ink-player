import { PluginRegistry } from "@inkweave/core";
import { Platform, Plugin, type TAbstractFile, type WorkspaceLeaf } from "obsidian";
import { setupCommands } from "./commands";
import { I18n, type TransItemType } from "./locales/i18n";
import { SettingsTab } from "./settings";
import { DEFAULT_SETTINGS, type Settings } from "./types";
import { plugins, reignsPlugin } from "./utils/plugins";
import { StoryView, VIEW_TYPE } from "./view";

export default class InkWeavePlugin extends Plugin {
  settings!: Settings;
  i18n!: I18n;

  t(x: TransItemType, vars?: Record<string, string>) {
    return this.i18n.t(x, vars);
  }

  getPluginSettings(): Record<string, boolean> {
    const { linedelay, debug, ...pluginSettings } = this.settings;
    return pluginSettings;
  }

  override async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));

    this.i18n = new I18n();

    this.registerView(VIEW_TYPE, (leaf) => new StoryView(leaf));
    this.registerExtensions(["ink"], "markdown");

    setupCommands(this);
  }

  async loadSettings() {
    PluginRegistry.registerLayout(reignsPlugin);
    for (const p of plugins) PluginRegistry.register(p);
    this.settings = Object.assign({}, DEFAULT_SETTINGS, (await this.loadData()) ?? {});
    PluginRegistry.setEnabled(this.getPluginSettings());
  }

  async updateSettings(settings: Partial<Settings>) {
    Object.assign(this.settings, settings);
    PluginRegistry.setEnabled(this.getPluginSettings());
    await this.saveData(this.settings);
  }

  async activateView(file: TAbstractFile | null = null) {
    const { workspace } = this.app;
    if (!file) {
      file = workspace.getActiveFile();
      if (!file) return;
    }
    const filePath = file.path;
    localStorage.setItem("inkweave-last-file", filePath);

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE);

    const viewState = {
      type: VIEW_TYPE,
      active: true,
      state: { filePath },
    };

    if (leaves.length > 0) {
      leaf = leaves[0] as WorkspaceLeaf;
      await leaf.setViewState(viewState);
    } else {
      if (Platform.isMobile) {
        const mobileLeaf = workspace.getLeaf(true);
        if (mobileLeaf) {
          leaf = mobileLeaf;
        }
      } else {
        const desktopLeaf = workspace.getLeaf(false);
        if (desktopLeaf) {
          leaf = workspace.createLeafBySplit(desktopLeaf);
        }
      }
      if (leaf) {
        await leaf.setViewState(viewState);
      }
    }

    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
}
