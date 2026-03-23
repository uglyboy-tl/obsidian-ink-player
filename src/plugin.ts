import {
	App,
	Plugin,
	WorkspaceLeaf,
	MarkdownView,
	Platform,
	PluginSettingTab,
	Setting,
	TAbstractFile,
	TFile,
} from "obsidian";
import { InkStoryView, INK_STORY_VIEW } from "view";
import { InkStorySettings, DEFAULT_SETTINGS } from "settings";
import { compiledStory } from "@/lib/markdown2story";
import { useFile, useStory } from "@/hooks";
import { useContents } from "@/hooks/story";
import { updatePlugins } from "patches";
import { I18n, type TransItemType } from "locales/i18n";

export class InkStorylugin extends Plugin {
	settings!: InkStorySettings;
	i18n!: I18n;
	private _sessionUnsub: (() => void) | null = null;
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new GeneralSettingsTab(this.app, this));
		this.updateRefreshSettings();

		// lang should be load early, but after settings
		this.i18n = new I18n();
		const t = (x: TransItemType, vars?: any) => {
			return this.i18n.t(x, vars);
		};

		const command_text = t("command_activate");
		this.registerView(INK_STORY_VIEW, (leaf) => new InkStoryView(leaf));

		this.addRibbonIcon("gamepad-2", command_text, () => {
			this.activateView();
		});

		this.addCommand({
			id: "activate-ink-story",
			name: command_text,
			icon: "gamepad-2",
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
						.setIcon("gamepad-2")
						.onClick(async () => {
							this.activateView(file);
						});
				});
			})
		);

		this.app.workspace.onLayoutReady(() => {
			const leaves = this.app.workspace.getLeavesOfType(INK_STORY_VIEW);
			if (leaves.length === 0) return;
			const savedPath = localStorage.getItem("ink-player-last-file");
			if (savedPath && !useStory.getState().ink) {
				const file = this.app.vault.getAbstractFileByPath(savedPath);
				if (file) {
					localStorage.setItem("ink-player-restore-session", "true");
					this.activateView(file);
				}
			}
		});

		this._sessionUnsub = useContents.subscribe(() => {
			const ink = useStory.getState().ink;
			const filePath = useFile.getState().filePath;
			if (!ink || !filePath) return;
			try {
				const save: Record<string, unknown> = { state: ink.story.state.toJson() };
				ink.save_label.forEach((label) => {
					if (label in ink && typeof ink[label as keyof typeof ink] !== "undefined")
						save[label] = ink[label as keyof typeof ink];
				});
				localStorage.setItem(`ink-session-${filePath}`, JSON.stringify(save));
			} catch (_) {}
		});
	}

	private async updateRefreshSettings() {
		updatePlugins(this.settings);
	}
	async onunload() {
		this._sessionUnsub?.();
	}

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

		const fileLeaf = workspace.getLeavesOfType("markdown").find(
			(leaf) => (leaf.view as MarkdownView).file?.path === filePath
		);
		const markdown =
			(fileLeaf?.view as MarkdownView)?.editor.getValue() ||
			(file instanceof TFile ? await vault.read(file) : "");

		const resourcePath = fileAdapter
			.getResourcePath(filePath)
			.split("/")
			.slice(0, -1)
			.join("/");
		useFile.getState().init(filePath, markdown, resourcePath);
		localStorage.setItem("ink-player-last-file", filePath);
		compiledStory();

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(INK_STORY_VIEW);

		const viewState = { type: INK_STORY_VIEW, active: true, state: { filePath } };

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

class GeneralSettingsTab extends PluginSettingTab {
	plugin: InkStorylugin;

	constructor(app: App, plugin: InkStorylugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	t(x: TransItemType, vars?: any) {
		return this.plugin.i18n.t(x, vars);
	}
	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName(this.t("settings_options"))
			.setHeading();

		new Setting(this.containerEl)
			.setName(this.t("options_linedelay_title"))
			.setDesc(this.t("options_linedelay_desc"))
			.addSlider((slider) => {
				slider
					.setLimits(0, 1, 0.05)
					.setDynamicTooltip()
					.setValue(
						this.plugin.settings.linedelay ??
							DEFAULT_SETTINGS.linedelay
					)
					.onChange(async (val) => {
						await this.plugin.updateSettings({
							linedelay: val,
						});
					});
			});

		new Setting(this.containerEl)
			.setName(this.t("settings_plugins"))
			.setHeading();

		new Setting(this.containerEl)
			.setName(this.t("settings_audio_title"))
			.setDesc(this.t("settings_audio_desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.audio)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({ audio: value })
					)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_image_title"))
			.setDesc(this.t("settings_image_desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.image)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({ image: value })
					)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_linkopen_title"))
			.setDesc(this.t("settings_linkopen_desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.linkopen).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							linkopen: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_memory_title"))
			.setDesc(this.t("settings_memory_desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.memory)
					.onChange(
						async (value) =>
							await this.plugin.updateSettings({ memory: value })
					)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_scrollafterchoice_title"))
			.setDesc(this.t("settings_scrollafterchoice_desc"))
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
			.setName(this.t("settings_fadeforline_title"))
			.setDesc(this.t("settings_fadeforline_desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.fadeforline).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							fadeforline: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_cdbutton_title"))
			.setDesc(this.t("settings_cdbutton_desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.cd_button).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							cd_button: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_autobutton_title"))
			.setDesc(this.t("settings_autobutton_desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.auto_button).onChange(
					async (value) =>
						await this.plugin.updateSettings({
							auto_button: value,
						})
				)
			);

		new Setting(this.containerEl)
			.setName(this.t("settings_autosave_title"))
			.setDesc(this.t("settings_autosave_desc"))
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
