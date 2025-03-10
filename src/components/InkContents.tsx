import { memo, useEffect, useRef, useState } from "react";
import { useContents } from "@/hooks/story";

const DELAY = 0.5;

interface InkContentsProps {
	className?: string;
	onContentComplete?: () => void;
}
const InkContentsComponent: React.FC<InkContentsProps> = ({
	className = "",
	onContentComplete = () => {},
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
