import { contentsStore } from "@inkweave/core";
import { memory } from "@inkweave/plugins";
import useFile from "@/utils/file";
import { VIEW_TYPE } from "../view";
import type { Feature } from "./index";

let cleanupFn: (() => void) | null = null;

export const autoRestore: Feature = {
  id: "auto_restore",
  setup: (plugin, settings) => {
    let autoSaveCleanup: (() => void) | null = null;
    const isEnabled = settings.auto_restore;

    const enable = () => {
      if (autoSaveCleanup) return;
      // Auto-save: save story state when content changes
      autoSaveCleanup = contentsStore.subscribe(() => {
        if (!isEnabled) return;
        const filePath = useFile.getState().filePath;
        if (!filePath) return;
        const leaves = plugin.app.workspace.getLeavesOfType(VIEW_TYPE);
        if (leaves.length === 0) return;
        const view = leaves[0].view as any;
        const ink = view?.ink;
        if (!ink) return;
        memory.save(0, ink);
      });

      // Auto-restore: restore last file on startup
      plugin.app.workspace.onLayoutReady(() => {
        if (!isEnabled) return;
        const leaves = plugin.app.workspace.getLeavesOfType(VIEW_TYPE);
        if (leaves.length === 0) return;
        const savedPath = localStorage.getItem("inkweave-last-file");
        const view = leaves[0].view as any;
        if (savedPath && !view?.ink) {
          const file = plugin.app.vault.getAbstractFileByPath(savedPath);
          if (file) {
            plugin.activateView(file);
          }
        }
      });

      cleanupFn = () => {
        if (autoSaveCleanup) {
          autoSaveCleanup();
          autoSaveCleanup = null;
        }
      };
    };

    if (settings.auto_restore) {
      enable();
    }
  },

  update: (_settings) => {
    // Currently auto_restore requires restart to take effect
  },

  cleanup: () => {
    cleanupFn?.();
    cleanupFn = null;
  },
};

export default autoRestore;
