import { memo, CSSProperties } from "react";
import { useContents, useStory } from "@/hooks/story";

interface InkContentsProps {
	DELAY: number;
	className?: string;
}
const InkContentsComponent: React.FC<InkContentsProps> = ({
	DELAY,
	className = "",
}) => {
	const ink = useStory.getState().ink;
	const contents = useContents.use.contents();
	const visibleLines =
		ink?.visibleLines != undefined ? ink.visibleLines : contents.length;

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
