import { memo, useEffect, useRef, createElement } from "react";
import { useChoices } from "@/hooks/story";
import { ChoiceParser, Choice } from "@/lib/ink";

interface InkChoicesProps {
	handleClick: (index: number) => void;
	className?: string;
	canShow?: boolean;
}
const InkChoicesComponent: React.FC<InkChoicesProps> = ({
	handleClick,
	className = "",
	canShow = true,
}) => {
	const choices = useChoices.use.choices();

	const lastButtonRef = useRef<HTMLElement | null>(null);
	const getCompontent = (choice: Choice) => {
		const Component = ChoiceParser.components.get(choice.type);
		if (!Component) return null;
		return createElement(Component, {
			onClick: () => handleClick(choice.index),
			className: `btn ${className}`,
			val: choice.val,
			children: choice.text,
		} as React.ComponentProps<typeof Component>);
	};

	useEffect(() => {
		lastButtonRef.current = document.querySelector(
			"ul#ink-choices > li:last-child"
		) as HTMLElement;

		if (lastButtonRef.current) {
			const element = document.querySelector("#ink-story") as HTMLElement;
			element.scrollTo({
				top: lastButtonRef.current.offsetTop,
				behavior: "smooth",
			});
		}
	}, [choices]);

	return (
		<ul
			id="ink-choices"
			key={canShow.toString()}
			style={{ visibility: canShow ? "visible" : "hidden" }}
		>
			{choices.map((choice) => (
				<li key={choice.index}>
					{ChoiceParser.components.get(choice.type) ? (
						getCompontent(choice)
					) : (
						<a
							onClick={() => {
								if (choice.type === "unclickable") return;
								handleClick(choice.index);
							}}
							className={`btn ${className} ${
								choice.type === "unclickable" ? "disabled" : ""
							}`}
							aria-disabled={choice.type === "unclickable"}
						>
							{choice.text}
						</a>
					)}
				</li>
			))}
		</ul>
	);
};

export default memo(InkChoicesComponent);
