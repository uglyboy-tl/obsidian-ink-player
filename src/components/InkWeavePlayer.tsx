import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins";
import { Story } from "@inkweave/react";
import { memo } from "react";
import InkWeaveMenu from "./InkWeaveMenu";

interface InkWeavePlayerProps {
  ink: InkStory;
}

const InkWeavePlayer: React.FC<InkWeavePlayerProps> = ({ ink }) => {
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
