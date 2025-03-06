import { memo, useEffect } from "react";
import { useChoices } from "@/hooks/story";
import CDButton from "./cdButton";
import AutoButton from "./autoButton";

interface InkChoicesProps {
	handleClick?: (index: number) => void;
	className?: string;
}
const InkChoicesComponent: React.FC<InkChoicesProps> = ({
	handleClick = (_) => {},
	className = "",
}) => {
	const choices = useChoices.use.choices();

	// 滚动处理
	useEffect(() => {
		requestAnimationFrame(() => {
			const lastButton = document.querySelector(
				"ul.container > li:last-child"
			) as HTMLElement;
			if (lastButton) {
				window.scrollTo({
					top: lastButton.offsetTop,
					behavior: "smooth",
				});
			}
		});
	}, [choices]);
	return (
		<ul className="">
			{choices.map((choice) => (
				<li key={choice.index} className="">
					{choice.type === "cd" ? (
						<CDButton
							cd={choice.cd}
							onClick={() => handleClick(choice.index)}
							className={`btn ${className}`}
						>
							{choice.text}
						</CDButton>
					) : choice.type === "auto" ? (
						<AutoButton
							cd={choice.cd}
							onClick={() => handleClick(choice.index)}
							className={`btn ${className}`}
						>
							{choice.text}
						</AutoButton>
					) : (
						<button
							onClick={() => {
								if (choice.type === "unclickable") return;
								handleClick(choice.index);
							}}
							className={`btn ${className}`}
							disabled={choice.type === "unclickable"}
						>
							{choice.text}
						</button>
					)}
				</li>
			))}
		</ul>
	);
};

export default memo(InkChoicesComponent);
