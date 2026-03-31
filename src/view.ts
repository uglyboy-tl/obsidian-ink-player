import "@inkweave/react/react.css";
import "@inkweave/plugins/plugins.css";
import "./styles/styles.custom.css";

import type { InkStory } from "@inkweave/core";
import { type EventRef, ItemView, type MarkdownView, TFile, type ViewStateResult } from "obsidian";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { InkWeavePlayer } from "@/components";
import useFile from "@/utils/file";
import { compiledStory } from "@/utils/storyCompiler";

export const VIEW_TYPE = "InkWeave Story View";

export class StoryView extends ItemView {
  root: Root | null = null;
  ink: InkStory | null = null;
  private watcher: EventRef | null = null;

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    const filePath = useFile.getState().filePath;
    if (!filePath) return "Ink Player";
    return (
      filePath
        .split("/")
        .pop()
        ?.replace(/\.ink$/i, "") ?? "Ink Player"
    );
  }

  getState() {
    return { filePath: useFile.getState().filePath };
  }

  async setState(state: { filePath?: string }, result: ViewStateResult) {
    const filePath = state?.filePath;
    const currentFilePath = useFile.getState().filePath;

    if (filePath && filePath !== currentFilePath) {
      await this.loadFile(filePath);
    }
    await super.setState(state, result);
  }

  private async loadFile(filePath: string) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;

    const { vault, workspace } = this.app;

    const fileLeaf = workspace
      .getLeavesOfType("markdown")
      .find((leaf) => (leaf.view as MarkdownView).file?.path === filePath);
    const editorContent = (fileLeaf?.view as MarkdownView)?.editor.getValue();
    const markdown =
      editorContent != null && editorContent !== "" ? editorContent : await vault.read(file);

    const resourcePath = vault.adapter.getResourcePath(filePath).split("/").slice(0, -1).join("/");

    const currentMarkdown = useFile.getState().markdown;
    useFile.getState().init(filePath, markdown, resourcePath);

    if (markdown !== currentMarkdown || this.ink?.title !== filePath) {
      this.ink = compiledStory();
      this.renderInk();
    }
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    this.root = createRoot(container);
    this.ink = compiledStory();
    this.renderInk();

    this.watcher = this.app.vault.on("modify", async (file) => {
      const filePath = useFile.getState().filePath;
      if (file.path === filePath && file instanceof TFile) {
        const markdown = await this.app.vault.read(file);
        const currentMarkdown = useFile.getState().markdown;

        if (markdown !== currentMarkdown) {
          const resourcePath = useFile.getState().resourcePath;
          useFile.getState().init(filePath, markdown, resourcePath);
          this.ink = compiledStory();
          this.renderInk();
        }
      }
    });
  }

  private renderInk() {
    if (this.root && this.ink) {
      this.root.render(createElement(InkWeavePlayer, { ink: this.ink }));
    }
  }

  async onClose() {
    if (this.watcher) {
      this.app.vault.offref(this.watcher);
    }
    this.ink?.dispose();
  }
}
