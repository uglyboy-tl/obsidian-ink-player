import { memo, useEffect } from "react";
import { InkStory } from "@/lib/ink";
import InkImage from "./InkImage";
import InkContents from "./InkContents";
import InkChoices from "./InkChoices";

interface InkStoryProps {
	ink: InkStory;
	className: string;
}

const InkStoryComponent: React.FC<InkStoryProps> = ({ ink, className }) => {
	useEffect(() => {
		ink.restart();
	}, [ink]);

	ink.useEffect();

	return (
		<div id="ink-story" className={className}>
			<InkImage image_src={ink.useImage} />
			<InkContents DELAY={ink.options.linedelay} />
			<InkChoices handleClick={(index) => ink.choose(index)} />
		</div>
	);
};

export default memo(InkStoryComponent);
