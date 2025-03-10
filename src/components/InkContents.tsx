import { memo, useEffect } from "react";
import { useContents } from "@/hooks/story";

interface InkContentsProps {
	className?: string;
	onContentComplete?: () => void;
	DELAY?: number;
}
const InkContentsComponent: React.FC<InkContentsProps> = ({
	className = "",
	onContentComplete = () => {},
	DELAY = 0.2,
}) => {
	const contents = useContents.use.contents();
	const last_content = useContents.getState().last_content;
	const visibleLines = contents.indexOf(last_content);

	useEffect(() => {
		const timer = setTimeout(() => {
			onContentComplete();
		}, (contents.length - visibleLines) * DELAY * 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [contents]);

	return (
		<section className="story-text">
			{contents.map((item, i) => (
				<div
					key={`${i}_${item}`}
					className=""
					style={{
						["--delay" as any]: `${
							(i > visibleLines ? i - visibleLines : 0) * DELAY
						}s`,
					}}
				>
					<p className={className}>{item}</p>
				</div>
			))}
		</section>
	);
};

export default memo(InkContentsComponent);
