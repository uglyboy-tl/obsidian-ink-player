import { memo, useEffect, CSSProperties } from "react";
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
			{contents.map((item, i) => {
				const style: CSSProperties = {
					"--delay": `${
						(i > visibleLines ? i - visibleLines : 0) * DELAY
					}s`,
				} as CSSProperties & { "--delay": string };

				return (
					<div key={`${i}_${item}`} style={style}>
						<p className={className}>{item}</p>
					</div>
				);
			})}
		</section>
	);
};

export default memo(InkContentsComponent);
