import { memo, useState } from "react";
import { ChoiceParser, ChoiceProps, Patches } from "@/lib/ink";

const CooldownChoice: React.FC<ChoiceProps> = ({
	val,
	onClick,
	className = "",
	children,
}) => {
	const [isDisabled, setIsDisabled] = useState(false);
	let cd = parseFloat(val);
	const handleClick = () => {
		if (isDisabled) return;

		if (onClick) {
			onClick();
			setIsDisabled(true);
		}

		setTimeout(() => {
			setIsDisabled(false);
		}, cd * 1000);
	};

	return (
		<a
			className={`btn ${className} ${isDisabled ? "disabled" : ""}`}
			onClick={handleClick}
		>
			{children}
		</a>
	);
};

const options = {
	linedelay: 0,
};

const load = () => {
	ChoiceParser.add(
		"cd",
		(new_choice, val) => {
			new_choice.type = "cd";
			new_choice.val = val;
		},
		memo(CooldownChoice)
	);
	Patches.add(null, options);
};

export default load;
