export class Plugin {}
export class ItemView {}
export class MarkdownView {}
export class WorkspaceLeaf {}
export class TFile {}
export class TAbstractFile {}
export class PluginSettingTab {}
export class Setting {
	setName() { return this; }
	setDesc() { return this; }
	setHeading() { return this; }
	addSlider() { return this; }
	addToggle() { return this; }
}
export const Platform = { isMobile: false };
export type ViewStateResult = Record<string, unknown>;
