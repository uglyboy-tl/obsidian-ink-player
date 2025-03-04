import { memo, useEffect } from "react";

interface AutoButtonProps {
	cd: number;
	onClick: () => void;
	display?: boolean;
	className?: string;
	children?: React.ReactNode;
}

const AutoButton: React.FC<AutoButtonProps> = ({
	cd,
	onClick,
	className = "",
	children,
}) => {
	// 滚动处理
	let auto: NodeJS.Timeout;
	useEffect(() => {
		auto = setTimeout(() => {
			handleClick();
		}, cd * 1000);
		return () => {
			clearTimeout(auto);
		};
	}, []);
	const handleClick = () => {
		console.log("AutoClick");
		onClick();

		auto = setTimeout(() => {
			handleClick();
		}, cd * 1000);
	};

	return <button className={`${className} hidden`}>{children}</button>;
};

export default memo(AutoButton);
