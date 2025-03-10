import { memo, useEffect, createElement } from "react";
import { useChoices } from "@/hooks/story";
import { ChoiceParser, Choice } from "@/lib/ink";

interface InkChoicesProps {
	handleClick: (index: number) => void;
	className?: string;
}
const InkChoicesComponent: React.FC<InkChoicesProps> = ({
	handleClick,
	className = "",
}) => {
	const choices = useChoices.use.choices();

	const getCompontent = (choice: Choice) =>{
		const Component = ChoiceParser.components[choice.type];
		if (!Component) return null;
		createElement(Component, {
			onClick: () => handleClick(choice.index),
			className: `btn ${className}`,
			val: choice.val,
			children: choice.text,
		}as React.ComponentProps<typeof Component>);
	};

	// 滚动处理
	useEffect(() => {
		requestAnimationFrame(() => {
			const lastButton = document.querySelector(
				"ul#ink-choices > li:last-child"
			) as HTMLElement;
			if (lastButton) {
				const element = document.querySelector(
					"#ink-screen"
				) as HTMLElement;
				element.scrollTo({
					top: lastButton.offsetTop,
					behavior: "smooth",
				});
			}
		});
	}, [choices]);

	return (
		<ul id="ink-choices" className="">
			{choices.map((choice) => (
				<li key={choice.index} className="">
					{ChoiceParser.components[choice.type] ? (
						getCompontent(choice)
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
