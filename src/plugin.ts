import {
	Plugin,
	WorkspaceLeaf,
	MarkdownView,
	FileSystemAdapter,
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
							const path = file.path;
							const markdown =
								this.app.workspace
									.getActiveViewOfType(MarkdownView)
									?.editor.getValue() || "";
							this.getInkStory(path, markdown);
						});
				});
			})
		);

		this.addRibbonIcon("dice", "激活 Ink Story", () => {
			const path = this.app.workspace.getActiveFile()?.path || "";
			const markdown =
				this.app.workspace
					.getActiveViewOfType(MarkdownView)
					?.editor.getValue() || "";
			this.getInkStory(path, markdown);
		});
	}

	async onunload() {}

	async getInkStory(path: string, markdown: string) {
		const file_adapter = this.app.vault.adapter as FileSystemAdapter;
		// 设置资源路径
		useFile
			.getState()
			.setSourcePath(
				this.app.vault.adapter
					.getResourcePath(path)
					.split("/")
					.slice(0, -1)
					.join("/")
			);
		// 获取文件真实路径

		compiledStory(file_adapter.getFullPath(path), markdown);
		this.activateView();
	}
	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(INK_STORY_VIEW);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.createLeafBySplit(workspace.getLeaf(false));
			await leaf.setViewState({ type: INK_STORY_VIEW, active: true });
		}

		workspace.revealLeaf(leaf);
	}
}
