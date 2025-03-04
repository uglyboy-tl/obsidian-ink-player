import { memo } from "react";
import { useStory, useScene, useVariables } from "@/hooks/story";
import InkChoices from "./InkChoices";
import InkContents from "./InkContents";

interface InkSreenProps {}
const InkScreenComponent: React.FC<InkSreenProps> = ({}) => {
	console.log("InkScreenComponent");
	const background = useScene.use.background();
	const image = useScene.use.image();
	const handleChoice = useStory.getState().handleChoice;

	return (
		<div
			className="container"
			style={{
				backgroundImage: `url(${background})`,
			}}
		>
			{image && (
				<img
					src={image}
					className=""
					alt="story image"
					width={500}
					height={500}
					style={{ maxWidth: "100%", height: "auto" }}
				/>
			)}
			<InkContents />
			<InkChoices handleClick={(index) => handleChoice(index)} />
		</div>
	);
};

export default memo(InkScreenComponent);
