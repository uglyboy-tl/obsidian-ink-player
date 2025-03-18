import {
	App,
	Plugin,
	WorkspaceLeaf,
	MarkdownView,
	Platform,
	PluginSettingTab,
	Setting,
	TAbstractFile,
	getLanguage,
} from "obsidian";
import { InkStoryView, INK_STORY_VIEW } from "view";
import { InkStorySettings, DEFAULT_SETTINGS } from "settings";
import { compiledStory } from "@/lib/markdown2story";
import { useFile } from "@/hooks";
import { updatePlugins } from "patches";

export class InkStorylugin extends Plugin {
	settings: InkStorySettings;
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new GeneralSettingsTab(this.app, this));
		this.updateRefreshSettings();

		const command_text =
			getLanguage() === "zh" ? "激活 Ink Story" : "Activate Ink Story";
		this.registerView(INK_STORY_VIEW, (leaf) => new InkStoryView(leaf));

		this.addRibbonIcon("dice", command_text, () => {
			this.activateView();
		});

		this.addCommand({
			id: "activate-ink-story",
			name: command_text,
			icon: "dice",
			checkCallback: (checking: boolean) => {
				const { workspace } = this.app;
				const markdownView =
					workspace.getActiveViewOfType(MarkdownView);
				const file = workspace.getActiveFile();
				if (markdownView && file) {
					if (markdownView.editor.getValue()) {
						if (!checking) {
							this.activateView(file);
						}
						return true;
					}
				}
			},
			callback: () => {
				this.activateView();
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle(command_text)
						.setIcon("dice")
						.onClick(async () => {
							this.activateView(file);
						});
				});
			})
		);
	}

	private async updateRefreshSettings() {
		updatePlugins(this.settings);
	}
	async onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			DEFAULT_SETTINGS,
			(await this.loadData()) ?? {}
		);
	}

	/** Update plugin settings. */
	async updateSettings(settings: Partial<InkStorySettings>) {
		Object.assign(this.settings, settings);
		this.updateRefreshSettings();
		await this.saveData(this.settings);
	}
	async activateView(file: TAbstractFile | null = null) {
		const { workspace, vault } = this.app;
		if (!file) {
			file = workspace.getActiveFile();
			if (!file) return;
		}
		const fileAdapter = vault.adapter;
		const filePath = file.path;
		const markdown =
			workspace.getActiveViewOfType(MarkdownView)?.editor.getValue() ||
			"";
		const resourcePath = fileAdapter
			.getResourcePath(filePath)
			.split("/")
			.slice(0, -1)
			.join("/");
		useFile.getState().init(filePath, markdown, resourcePath);
		compiledStory();

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(INK_STORY_VIEW);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			if (Platform.isMobile) {
				leaf = workspace.getLeaf(true);
				await leaf.setViewState({ type: INK_STORY_VIEW, active: true });
			} else {
				leaf = workspace.createLeafBySplit(workspace.getLeaf(false));
				await leaf.setViewState({ type: INK_STORY_VIEW, active: true });
			}
		}

		workspace.revealLeaf(leaf);
	}
}

class GeneralSettingsTab extends PluginSettingTab {
	plugin: InkStorylugin;

	constructor(app: App, plugin: InkStorylugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl).setName("Plugins").setHeading();

		new Setting(this.containerEl)
			.setName("Use Audio")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.audio)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({ audio: value })
					)
			);

		new Setting(this.containerEl)
			.setName("Use Image")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.image)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({ image: value })
					)
			);

		new Setting(this.containerEl)
			.setName("Open link in new tab")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.linkopen).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							linkopen: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName("Use Memory")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.memory)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({ memory: value })
					)
			);

		new Setting(this.containerEl)
			.setName("Scroll after choice")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.scrollafterchoice)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({
								scrollafterchoice: value,
							})
					)
			);

		new Setting(this.containerEl)
			.setName("Fade for line")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.fadeforline).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							fadeforline: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName("CD Button")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.cd_button).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							cd_button: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName("Auto Button")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.auto_button).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							auto_button: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName("Auto Save")
			.setDesc(
				"Enable or disable executing regular inline Dataview queries."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.auto_save).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							auto_save: value,
						})
				)
			);
	}
}
