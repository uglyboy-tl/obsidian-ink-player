import "@inkweave/solidjs/solidjs.css";
import "@inkweave/plugins/solidjs.css";
import "./styles/styles.custom.css";

import type { InkStory, StatusBarConfig } from "@inkweave/core";
import { PluginRegistry } from "@inkweave/core";
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
  private frontmatter: {
    title?: string;
    display?: string;
    statusBar?: StatusBarConfig[];
  } = {};

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

    if (filePath) {
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
      this.appInstance = render(
        () => App({ ink, statusBar: this.frontmatter.statusBar }),
        container as HTMLElement,
      );
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
      this.ink = null;
    }

    if (!this.ink) {
      const cache = this.app.metadataCache.getFileCache(file);
      this.frontmatter = cache?.frontmatter ?? {};
      PluginRegistry.setLayout(this.frontmatter.display ?? null);
      this.ink = compile();
    }

    this.render();
  }

  override async onOpen() {
    this.watcher = this.app.vault.on("modify", async (file) => {
      const filePath = useFile.getState().filePath;
      if (file.path === filePath && file instanceof TFile) {
        const markdown = await this.app.vault.read(file);
        const currentMarkdown = useFile.getState().markdown;

        if (markdown !== currentMarkdown) {
          const resourcePath = useFile.getState().resourcePath;
          useFile.getState().init(filePath, markdown, resourcePath);
          const cache = this.app.metadataCache.getFileCache(file);
          this.frontmatter = cache?.frontmatter ?? {};
          PluginRegistry.setLayout(this.frontmatter.display ?? null);
          this.ink?.dispose();
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
    this.ink = null;
    if (this.appInstance) {
      this.appInstance();
      this.appInstance = null;
    }
  }
}
