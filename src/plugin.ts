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

		this.addRibbonIcon("dice", "Activate view", () => {
			const path = this.app.workspace.getActiveFile()?.path || "";
			const markdown =
				this.app.workspace
					.getActiveViewOfType(MarkdownView)
					?.editor.getValue() || "";
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
			const file_adapter = this.app.vault.adapter as FileSystemAdapter;
			compiledStory(file_adapter.getFullPath(path), markdown);
			this.activateView();
		});
	}

	async onunload() {}

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
