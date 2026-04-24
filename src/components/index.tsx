import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins";
import { Story } from "@inkweave/react";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import InkWeaveMenu from "./InkWeaveMenu";

export const render = (root: Root | undefined | null, ink: InkStory | undefined | null) => {
  if (!root || !ink) return;
  root.render(
    <StrictMode>
      <div id="inkweave-player" className="container">
        <InkWeaveMenu ink={ink} />
        <Story ink={ink} className="markdown-preview-view">
          <Image className="inkweave-image" />
        </Story>
      </div>
    </StrictMode>,
  );
};
