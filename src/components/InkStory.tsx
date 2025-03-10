import { memo, useEffect } from "react";
import { useStory } from "@/hooks";
import InkScreen from "./InkScreen";
import InkMenu from "./InkMenu";

const InkComponent: React.FC = () => {
	const ink = useStory.use.ink();

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

	return (
		<div className="ink">
			<InkMenu />
			<InkScreen className="markdown-preview-view" />
		</div>
	);
};

export default memo(InkComponent);
