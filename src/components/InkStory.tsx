import { memo, useEffect } from "react";
import { useStory } from "@/hooks";
import InkScreen from "./InkScreen";
import InkMenu from "./InkMenu";

const InkComponent: React.FC = () => {
	const story = useStory.use.story();

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
