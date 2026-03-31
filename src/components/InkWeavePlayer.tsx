import type { InkStory } from "@inkweave/core";
import { Image, memory } from "@inkweave/plugins";
import { Story } from "@inkweave/react";
import { memo, useEffect, useRef } from "react";
import InkWeaveMenu from "./InkWeaveMenu";

const AUTO_SAVE_SLOT = 0;

interface InkWeavePlayerProps {
  ink: InkStory;
}

const InkWeavePlayer: React.FC<InkWeavePlayerProps> = ({ ink }) => {
  const loadedRef = useRef(false);
  const saves = memory.show(ink.title);
  const autosave = saves?.[AUTO_SAVE_SLOT];

  useEffect(() => {
    if (loadedRef.current) return;
    if (autosave) {
      loadedRef.current = true;
      memory.load(autosave.data, ink);
    }
  }, [ink, autosave]);

  return (
    <div id="inkweave-player" className="container">
      <InkWeaveMenu ink={ink} />
      <Story ink={ink} className="markdown-preview-view">
        <Image className="inkweave-image" />
      </Story>
    </div>
  );
};

export default memo(InkWeavePlayer);
