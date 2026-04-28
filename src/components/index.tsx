import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins";
import { CommandBar, Story } from "@inkweave/react";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import { t } from "../locales/i18n";
import styles from "./styles.module.css";

export const render = (root: Root | undefined | null, ink: InkStory | undefined | null) => {
  if (!root || !ink) return;
  root.render(
    <StrictMode>
      <div id="inkweave-player" className="container">
        <nav className="view-header">
          <div className="view-header-title-container mod-at-start mod-fade"></div>
          <CommandBar
            ink={ink}
            className="view-actions"
            buttonClassName="clickable-icon nav-action-button"
            modalClassName={styles.modal}
            t={t}
          />
        </nav>
        <Story ink={ink} className="markdown-preview-view">
          <Image className="inkweave-image" />
        </Story>
      </div>
    </StrictMode>,
  );
};
