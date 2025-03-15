import { memo, useEffect, useState } from "react";
import { useImage } from "@/hooks/story";
import { InkStory } from "@/lib/ink";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";

interface InkStoryProps {
	ink: InkStory;
	className: string;
}

const InkStoryComponent: React.FC<InkStoryProps> = ({ ink, className = "" }) => {
	const { image } = useImage();
	const [contentComplete, setContentComplete] = useState(true);
	const DELAY: number = ink.options.linedelay;

	useEffect(() => {
		if (ink) {
			ink.restart();
		}
	}, [ink]);

	const handleContentComplete = () => {
		setContentComplete(true);
	};

	const handleClick = (index: number) => {
		if (DELAY > 0) {
			setContentComplete(false);
		}
		ink.choose(index);
	};

	return (
		<div id="ink-story" className={className}>
			{image && (
				<div id="ink-image">
					<img src={image} />
				</div>
			)}
			<InkContents
				onContentComplete={handleContentComplete}
				DELAY={DELAY}
			/>
			<InkChoices handleClick={handleClick} canShow={contentComplete} />
		</div>
	);
};

export default memo(InkStoryComponent);
