import { memo, useEffect } from "react";
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
			<InkContents />
			<InkChoices
				handleClick={(index) => useStory.getState().ink?.choose(index)}
			/>
		</div>
	);
};

export default memo(InkScreenComponent);
