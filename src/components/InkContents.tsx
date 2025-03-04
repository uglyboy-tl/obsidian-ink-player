import { memo } from "react";
import { useContents } from "@/hooks/story";

interface InkContentsProps {
	className?: string;
}
const InkContentsComponent: React.FC<InkContentsProps> = ({
	className = "",
}) => {
	const contents = useContents.use.contents();
	return (
		<section className="story-text">
			{contents.map((item, i) => (
				<div key={i} className="mx-2">
					<p className={className}>{item}</p>
				</div>
			))}
		</section>
	);
};

export default memo(InkContentsComponent);
