import { memo, useEffect, useState } from "react";
import { useStory, useScene } from "@/hooks/story";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";

interface InkScreenProps {
	className: string;
}

const InkScreenComponent: React.FC<InkScreenProps> = ({ className = "" }) => {
	const ink = useStory.use.ink();
	const { image } = useScene();
	const [contentComplete, setContentComplete] = useState(true);
	const DELAY: number = ink?.options.linedelay;
	// 初始化故事
	useEffect(() => {
		if (ink) {
			ink.restart();
		}
	}, [ink]);

	if (!ink) {
		console.log("story is null");
		return null;
	}

	const handleContentComplete = () => {
		setContentComplete(true);
	};

	const handleClick = (index: number) => {
		if (DELAY > 0) {
			setContentComplete(false);
		}
		useStory.getState().ink?.choose(index);
	};

	return (
		<div id="ink-screen" className={className}>
			{image && (
				<div className="ink-image">
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

export default memo(InkScreenComponent);
