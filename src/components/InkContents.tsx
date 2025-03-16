import { memo, CSSProperties } from "react";
import { useContents } from "@/hooks/story";

interface InkContentsProps {
	DELAY: number;
	visibleLines: number;
	className?: string;
}
const InkContentsComponent: React.FC<InkContentsProps> = ({
	DELAY,
	visibleLines,
	className = "",
}) => {
	const contents = useContents.use.contents();

	return (
		<section id="ink-contents">
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
