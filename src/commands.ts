import { MarkdownView } from "obsidian";
import type InkWeavePlugin from "./plugin";

export const setupCommands = (plugin: InkWeavePlugin) => {
  const commandText = plugin.i18n.t("command_activate");

  // Ribbon icon
  plugin.addRibbonIcon("gamepad-2", commandText, () => {
    plugin.activateView();
  });

  // Command
  plugin.addCommand({
    id: "activate-ink-story",
    name: commandText,
    icon: "gamepad-2",
    checkCallback: (checking: boolean) => {
      const { workspace } = plugin.app;
      const markdownView = workspace.getActiveViewOfType(MarkdownView);
      const file = workspace.getActiveFile();
      if (markdownView && file) {
        if (markdownView.editor.getValue()) {
          if (!checking) {
            plugin.activateView(file);
          }
          return true;
        }
      }
    },
    callback: () => {
      plugin.activateView();
    },
  });

  // Right-click menu
  plugin.registerEvent(
    plugin.app.workspace.on("file-menu", (menu, file) => {
      menu.addItem((item) => {
        item
          .setTitle(commandText)
          .setIcon("gamepad-2")
          .onClick(async () => {
            plugin.activateView(file);
          });
      });
    }),
  );
};
