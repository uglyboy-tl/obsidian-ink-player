import { memo } from "react";
import { useStory } from "@/hooks/story";
import InkStory from "./InkStory";
import InkMenu from "./InkMenu";

const InkComponent: React.FC = () => {
	const ink = useStory.use.ink();
	if (!ink) return null;
	return (
		<div id="ink" className="container">
			<InkMenu />
			<InkStory ink={ink} className="markdown-preview-view" />
		</div>
	);
};

export default memo(InkComponent);
