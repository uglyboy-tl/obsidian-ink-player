import { ItemView, WorkspaceLeaf } from "obsidian";
import { createElement } from "react";
import { Root, createRoot } from "react-dom/client";
import { InkStory } from "@/components";
import { useFile, useStory } from "@/hooks";

export const INK_STORY_VIEW = "Ink Story View";

export class InkStoryView extends ItemView {
	root: Root | null = null;
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return INK_STORY_VIEW;
	}

	getDisplayText() {
		return useFile.getState().filePath;
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		this.root = createRoot(container);
		this.root.render(createElement(InkStory));
	}

	async onClose() {
		useStory.getState().ink?.dispose();
	}
}
