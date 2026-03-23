import { memo, useEffect } from "react";
import { InkStory } from "@/lib/ink";
import InkImage from "./InkImage";
import InkContents from "./InkContents";
import InkChoices from "./InkChoices";
import memory from "@/lib/patches/memory";

const SESSION_RESTORE_FLAG = "ink-player-restore-session";

interface InkStoryProps {
	ink: InkStory;
	className: string;
}

const InkStoryComponent: React.FC<InkStoryProps> = ({ ink, className }) => {
	useEffect(() => {
		const sessionData = localStorage.getItem(SESSION_RESTORE_FLAG)
			? localStorage.getItem(`ink-session-${ink.title}`)
			: null;

		if (sessionData) {
			ink.story.ResetState();
			ink.clear();
			memory.load(sessionData, ink);
			localStorage.removeItem(SESSION_RESTORE_FLAG);
		} else {
			ink.restart();
		}
	}, [ink]);

	return (
		<div id="ink-story" className={className}>
			<InkImage image_src={ink.useImage} />
			<InkContents DELAY={ink.options.linedelay} />
			<InkChoices handleClick={(index) => ink.choose(index)} />
		</div>
	);
};

export default memo(InkStoryComponent);
