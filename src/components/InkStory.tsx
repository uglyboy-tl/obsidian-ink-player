import { memo } from "react";
import InkScreen from "./InkScreen";
import InkMenu from "./InkMenu";

const InkComponent: React.FC = () => {
	return (
		<div className="ink">
			<InkMenu />
			<InkScreen className="markdown-preview-view" />
		</div>
	);
};

export default memo(InkComponent);
