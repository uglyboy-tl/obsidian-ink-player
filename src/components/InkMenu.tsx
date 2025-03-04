import { memo, useRef, useState } from "react";
import { useStory } from "@/hooks";
import { MdSave, MdRestore, MdReplay } from "react-icons/md";

interface GameMenuProps {}
const GameMenu: React.FC<GameMenuProps> = ({}) => {
	const [type, setType] = useState<string>("");
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const openModal = (type: string) => {
		if (modalRef.current && type) {
			modalRef.current.showModal();
		}
		setType(type);
	};

	return (
		<nav className="nav">
			<div className="container">
				<button
					className="btn"
					onClick={() => {
						setType("restore");
						openModal("restore");
					}}
				>
					<MdRestore />
				</button>
				<button
					className="btn"
					onClick={() => {
						setType("save");
						openModal("save");
					}}
				>
					<MdSave />
				</button>
				<button className="btn" onClick={useStory.getState().restart}>
					<MdReplay />
				</button>
			</div>
			{/* <GameMenuModal modalRef={modalRef} type={type} /> */}
		</nav>
	);
};

export default memo(GameMenu);
