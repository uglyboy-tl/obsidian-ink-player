import { Plugin, WorkspaceLeaf, MarkdownView } from "obsidian";
import { InkStoryView, INK_STORY_VIEW } from "./view";
import { compiledStory } from "@/lib/markdown2story";

export class InkStorylugin extends Plugin {
	async onload() {
		this.registerView(INK_STORY_VIEW, (leaf) => new InkStoryView(leaf));

		this.addRibbonIcon("dice", "Activate view", () => {
			// 获取 Obsidian 当前编辑的文件的文件夹的路径
			const path = this.app.vault.adapter.getFullPath(
				this.app.workspace.getActiveFile()?.path || ""
			);
			// 获取当前编辑区的文件的 markdown 源码
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			let markdown = view?.editor.getValue() || "";
			compiledStory(path, markdown);
			this.activateView();
		});
	}

	async onunload() {}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(INK_STORY_VIEW);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.splitActiveLeaf();
			await leaf.setViewState({ type: INK_STORY_VIEW, active: true });
		}

		workspace.revealLeaf(leaf);
	}
}
