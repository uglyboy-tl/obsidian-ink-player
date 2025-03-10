import { memo, useState } from "react";
import { useStory, useScene } from "@/hooks/story";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";

interface InkScreenProps {
	className: string;
}

const InkScreenComponent: React.FC<InkScreenProps> = ({ className = "" }) => {
	const { image } = useScene();
	const [contentComplete, setContentComplete] = useState(true);

	const handleContentComplete = () => {
		setContentComplete(true);
	};

	const handleClick = (index: number) => {
		setContentComplete(false);
		useStory.getState().ink?.choose(index);
	};

	return (
		<div id="ink-screen" className={className}>
			{image && (
				<div className="ink-image">
					<img src={image} />
				</div>
			)}
			<InkContents onContentComplete={handleContentComplete} />
			<InkChoices handleClick={handleClick} canShow={contentComplete} />
		</div>
	);
};

export default memo(InkScreenComponent);
