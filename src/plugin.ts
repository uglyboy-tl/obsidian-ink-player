import {
	Plugin,
	WorkspaceLeaf,
	MarkdownView,
	FileSystemAdapter,
	TAbstractFile,
	Platform,
} from "obsidian";
import { InkStoryView, INK_STORY_VIEW } from "./view";
import { compiledStory } from "@/lib/markdown2story";
import { useFile } from "@/hooks";

export class InkStorylugin extends Plugin {
	async onload() {
		this.registerView(INK_STORY_VIEW, (leaf) => new InkStoryView(leaf));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("激活 Ink Story")
						.setIcon("dice")
						.onClick(async () => {
							this.init(file);
							this.activateView();
						});
				});
			})
		);

		this.addRibbonIcon("dice", "激活 Ink Story", () => {
			const file = this.app.workspace.getActiveFile();
			if (!file) return;
			this.init(file);
			this.activateView();
		});
	}

	async onunload() {}

	init(file: TAbstractFile) {
		const fileAdapter = this.app.vault.adapter as FileSystemAdapter;
		const filePath = file.path;
		const markdown =
			this.app.workspace
				.getActiveViewOfType(MarkdownView)
				?.editor.getValue() || "";
		const resourcePath = fileAdapter
			.getResourcePath(filePath)
			.split("/")
			.slice(0, -1)
			.join("/");
		useFile.getState().init(filePath, markdown, resourcePath);
		compiledStory();
	}
	async activateView() {
		const { workspace } = this.app;

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
