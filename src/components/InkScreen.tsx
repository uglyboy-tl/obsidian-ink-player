import { memo, useEffect, useState } from "react";
import { useStory, useScene } from "@/hooks/story";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";

interface InkScreenProps {
	className: string;
}

const InkScreenComponent: React.FC<InkScreenProps> = ({ className = "" }) => {
	const { background, image, cleanupMusic, cleanupSound } = useScene();

	useEffect(() => {
		return () => cleanupSound();
	}, [cleanupSound]);

	useEffect(() => {
		return () => cleanupMusic();
	}, [cleanupMusic]);

	const [contentComplete, setContentComplete] = useState(false);

	const handleContentComplete = () => {
		setContentComplete(true);
	};

	const handleClick = (index: number) => {
		setContentComplete(false);
		useStory.getState().ink?.choose(index);
	};

	return (
		<div
			id="ink-screen"
			className={className}
			style={{
				backgroundImage: `url(${background})`,
			}}
		>
			{image && (
				<div className="ink-image">
					<img src={image} />
				</div>
			)}
			<InkContents onContentComplete={handleContentComplete} />
			{contentComplete && <InkChoices handleClick={handleClick} />}
		</div>
	);
};

export default memo(InkScreenComponent);
