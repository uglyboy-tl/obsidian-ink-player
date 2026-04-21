import { applySettings } from "applySettings";
import { I18n, type TransItemType } from "locales/i18n";
import { Platform, Plugin, type TAbstractFile, type WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, type Settings } from "settings";
import { StoryView, VIEW_TYPE } from "view";
import { setupCommands } from "./commands";
import { SettingsTab } from "./settingsTab";

export default class InkWeavePlugin extends Plugin {
  settings!: Settings;
  i18n!: I18n;

  t(x: TransItemType, vars?: Record<string, string>) {
    return this.i18n.t(x, vars);
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));
    this.updateRefreshSettings();

    this.i18n = new I18n();

    this.registerView(VIEW_TYPE, (leaf) => new StoryView(leaf));
    this.registerExtensions(["ink"], "markdown");

    setupCommands(this);
  }

  private updateRefreshSettings() {
    applySettings(this.settings);
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, (await this.loadData()) ?? {});
  }

  async updateSettings(settings: Partial<Settings>) {
    Object.assign(this.settings, settings);
    this.updateRefreshSettings();
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
      leaf = leaves[0];
      await leaf.setViewState(viewState);
    } else {
      if (Platform.isMobile) {
        leaf = workspace.getLeaf(true);
      } else {
        leaf = workspace.createLeafBySplit(workspace.getLeaf(false));
      }
      await leaf.setViewState(viewState);
    }

    workspace.revealLeaf(leaf);
  }
}
