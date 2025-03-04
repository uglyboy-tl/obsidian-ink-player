import { memo, useEffect } from "react";
import { useStory, useError } from "@/hooks";
import InkScreen from "./InkScreen";
import InkMenu from "./InkMenu";

interface RenderResultProps {}

const InkComponent: React.FC<RenderResultProps> = ({}) => {
	const story = useStory.use.story();
	const error = useError.use.error();

	// 初始化故事
	useEffect(() => {
		if (story) {
			useStory.getState().restart();
		}
	}, [story]);

	if (!story) {
		console.log("story is null");
		return null;
	}

	return (
		<div className="ink">
			<InkMenu />
			<InkScreen />
		</div>
	);
};

export default memo(InkComponent);
