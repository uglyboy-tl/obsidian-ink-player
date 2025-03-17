import { memo, createElement } from "react";
import { useChoices, useStory } from "@/hooks/story";
import { ChoiceParser, Choice } from "@/lib/ink";

interface InkChoicesProps {
	handleClick: (index: number) => void;
	className?: string;
}
const InkChoicesComponent: React.FC<InkChoicesProps> = ({
	handleClick,
	className = "btn",
}) => {
	const ink = useStory.getState().ink;
	const choices = useChoices.use.choices();
	const canShow = (ink && "choicesCanShow" in ink) ? ink.choicesCanShow : true;
	const getCompontent = (choice: Choice) => {
		const Component = ChoiceParser.components.get(choice.type);
		if (!Component) return null;
		return createElement(Component, {
			onClick: () => handleClick(choice.index),
			className: className,
			val: choice.val,
			children: choice.text,
		} as React.ComponentProps<typeof Component>);
	};

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
							className={`${className} ${
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
