import { memo, useEffect } from "react";
import { ChoiceParser, ChoiceProps } from "@/lib/ink";
const AutoChoice: React.FC<ChoiceProps> = ({
	val,
	onClick,
	className = "",
	children,
}) => {
	// 滚动处理
	let auto: number;
	let cd = parseFloat(val);
	useEffect(() => {
		auto = window.setTimeout(() => {
			handleClick();
		}, cd * 1000);
		return () => {
			window.clearTimeout(auto);
		};
	}, []);
	const handleClick = () => {
		onClick();

		auto = window.setTimeout(() => {
			handleClick();
		}, cd * 1000);
	};

	return (
		<a className={`btn ${className}`} style={{ display: "none" }}>
			{children}
		</a>
	);
};

const load = () => {
	ChoiceParser.add(
		"auto",
		(new_choice, val) => {
			new_choice.type = "auto";
			new_choice.val = val;
		},
		memo(AutoChoice)
	);
};

export default load;
