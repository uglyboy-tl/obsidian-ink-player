import "@inkweave/solidjs/solidjs.css";
import "@inkweave/plugins/solidjs.css";
import "./styles/styles.custom.css";

import type { InkStory } from "@inkweave/core";
import { type EventRef, ItemView, type MarkdownView, TFile, type ViewStateResult } from "obsidian";
import { render } from "solid-js/web";
import App from "./App";
import { compile } from "./utils/compile";
import { default as useFile } from "./utils/file";

export const VIEW_TYPE = "InkWeave Story View";

export class StoryView extends ItemView {
  appInstance: (() => void) | null = null;
  ink: InkStory | null = null;
  private watcher: EventRef | null = null;

  override getViewType() {
    return VIEW_TYPE;
  }

  override getDisplayText() {
    const filePath = useFile.getState().filePath;
    if (!filePath) return "Ink Player";
    return (
      filePath
        .split("/")
        .pop()
        ?.replace(/\.ink$/i, "") ?? "Ink Player"
    );
  }

  override getState() {
    return { filePath: useFile.getState().filePath };
  }

  override async setState(state: { filePath?: string }, result: ViewStateResult) {
    const filePath = state?.filePath;
    const currentFilePath = useFile.getState().filePath;

    if (filePath && filePath !== currentFilePath) {
      await this.loadFile(filePath);
    }
    await super.setState(state, result);
  }

  private isMarkdownView(view: unknown): view is MarkdownView {
    return view != null && typeof view === "object" && "editor" in view && "file" in view;
  }

  private render() {
    const container = this.containerEl.children[1];
    if (!container) return;

    if (this.appInstance) {
      this.appInstance();
      this.appInstance = null;
    }

    if (this.ink) {
      const ink = this.ink;
      this.appInstance = render(() => App({ ink }), container as HTMLElement);
    }
  }

  private async loadFile(filePath: string) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;

    const { vault, workspace } = this.app;

    const fileLeaf = workspace
      .getLeavesOfType("markdown")
      .find((leaf) => this.isMarkdownView(leaf.view) && leaf.view.file?.path === filePath);
    const editorContent =
      fileLeaf && this.isMarkdownView(fileLeaf.view) ? fileLeaf.view.editor.getValue() : null;
    const markdown =
      editorContent != null && editorContent !== "" ? editorContent : await vault.read(file);

    const resourcePath = vault.adapter.getResourcePath(filePath).split("/").slice(0, -1).join("/");

    const currentMarkdown = useFile.getState().markdown;
    useFile.getState().init(filePath, markdown, resourcePath);

    if (markdown !== currentMarkdown || this.ink?.title !== filePath) {
      this.ink?.dispose();
      this.ink = compile();
      this.render();
    }
  }

  override async onOpen() {
    this.ink = compile();
    this.render();

    this.watcher = this.app.vault.on("modify", async (file) => {
      const filePath = useFile.getState().filePath;
      if (file.path === filePath && file instanceof TFile) {
        const markdown = await this.app.vault.read(file);
        const currentMarkdown = useFile.getState().markdown;

        if (markdown !== currentMarkdown) {
          const resourcePath = useFile.getState().resourcePath;
          useFile.getState().init(filePath, markdown, resourcePath);
          this.ink = compile();
          this.render();
        }
      }
    });
  }

  override async onClose() {
    if (this.watcher) {
      this.app.vault.offref(this.watcher);
    }
    this.ink?.dispose();
    if (this.appInstance) {
      this.appInstance();
      this.appInstance = null;
    }
  }
}
