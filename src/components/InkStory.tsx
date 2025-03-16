import { memo, useEffect } from "react";
import { InkStory } from "@/lib/ink";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";

interface InkStoryProps {
	ink: InkStory;
	className: string;
}

const InkStoryComponent: React.FC<InkStoryProps> = ({ ink, className }) => {
	useEffect(() => {
		ink.restart();
	}, [ink]);

	ink.useEffect();

	const image_src = ink.image;

	return (
		<div id="ink-story" className={className}>
			{image_src && (
				<div id="ink-image">
					<img src={image_src} />
				</div>
			)}
			<InkContents
				DELAY={ink.options.linedelay}
				visibleLines={ink.visibleLines}
			/>
			<InkChoices
				handleClick={(index) => ink.choose(index)}
				canShow={ink.choicesCanShow}
			/>
		</div>
	);
};

export default memo(InkStoryComponent);
