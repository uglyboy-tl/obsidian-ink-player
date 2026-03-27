import { memo } from "react";
import { Story, Contents, Choices } from "@inkweave/react";
import { Image } from '@inkweave/plugins';
import { InkStory } from "@inkweave/core";
import InkWeaveMenu from "./InkWeaveMenu";

interface InkWeavePlayerProps {
	ink: InkStory;
}

const InkWeavePlayer: React.FC<InkWeavePlayerProps> = ({ ink }) => {
	return (
		<div id="inkweave-player" className="container">
			<InkWeaveMenu ink={ink} />
			<Story ink={ink}>
				<div className="markdown-preview-view">
					<Image />
					<Contents lineDelay={ink.options.linedelay} />
					<Choices />
				</div>
			</Story>
		</div>
	);
};

export default memo(InkWeavePlayer);