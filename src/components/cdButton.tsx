import { memo, useState } from "react";

interface CooldownButtonProps {
	cd: number;
	onClick: () => void;
	className?: string;
	children?: React.ReactNode;
}

const CooldownButton: React.FC<CooldownButtonProps> = ({
	cd,
	onClick,
	className = "",
	children,
}) => {
	const [isDisabled, setIsDisabled] = useState(false);
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
		<button
			className={className}
			onClick={handleClick}
			disabled={isDisabled}
		>
			{children}
		</button>
	);
};

export default memo(CooldownButton);
