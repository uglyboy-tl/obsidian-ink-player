import { memo, useEffect } from "react";
import { useStory, useScene } from "@/hooks/story";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";
const InkScreenComponent: React.FC = () => {
	const background = useScene.use.background();
	const image = useScene.use.image();
	const { cleanupMusic, cleanupSound } = useScene();
	const handleChoice = useStory.getState().handleChoice;

	useEffect(() => {
		return () => cleanupSound();
	}, [cleanupSound]);

	useEffect(() => {
		return () => cleanupMusic();
	}, [cleanupMusic]);

	return (
		<div
			className="markdown-preview-view"
			style={{
				backgroundImage: `url(${background})`,
			}}
		>
			{image && (
				<div className="ink-image">
					<img src={image} />
				</div>
			)}
			<InkContents />
			<InkChoices handleClick={(index) => handleChoice(index)} />
		</div>
	);
};

export default memo(InkScreenComponent);
