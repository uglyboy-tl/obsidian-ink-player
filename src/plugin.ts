import {
	App,
	Plugin,
	WorkspaceLeaf,
	MarkdownView,
	FileSystemAdapter,
	Platform,
	PluginSettingTab,
	Setting,
	TAbstractFile,
	getLanguage,
} from "obsidian";
import { InkStoryView, INK_STORY_VIEW } from "./view";
import { compiledStory } from "@/lib/markdown2story";
import { useFile } from "@/hooks";

interface InkStoryluginSettings {
	testSetting: string;
}

const DEFAULT_SETTINGS: InkStoryluginSettings = {
	testSetting: "default",
};

export class InkStorylugin extends Plugin {
	settings: InkStoryluginSettings;
	async onload() {
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InkStoryluginSettingTab(this.app, this));
	}

	async onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	async activateView(file: TAbstractFile | null = null) {
		const { workspace, vault } = this.app;
		if (!file) {
			file = workspace.getActiveFile();
			if (!file) return;
		}
		const fileAdapter = vault.adapter as FileSystemAdapter;
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

class InkStoryluginSettingTab extends PluginSettingTab {
	plugin: InkStorylugin;

	constructor(app: App, plugin: InkStorylugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.testSetting)
				.onChange(async (value) => {
					this.plugin.settings.testSetting = value;
					await this.plugin.saveSettings();
				}));
	}
}