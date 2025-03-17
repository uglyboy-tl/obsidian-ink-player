import { memo, useRef, useState, useCallback } from "react";
import { useStory } from "@/hooks";
import { MdSave, MdRestore, MdReplay } from "react-icons/md";
import GameMenuModal from "./InkMenuModal";

const GameMenu: React.FC = () => {
	const [type, setType] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const openModal = useCallback((type: string) => {
		if (modalRef.current && type) {
			setTitle(useStory.getState().ink?.title || "");
			modalRef.current.showModal();
		}
		setType(type);
	}, []);

	return (
		<nav className="view-header">
			<div className="view-header-title-container mod-at-start mod-fade"></div>
			<div className="view-actions">
				<button
					className="clickable-icon nav-action-button"
					onClick={() => {
						openModal("restore");
					}}
				>
					<MdRestore size={18} />
				</button>
				<button
					className="clickable-icon nav-action-button"
					onClick={() => {
						openModal("save");
					}}
				>
					<MdSave size={18} />
				</button>
				<button
					className="clickable-icon nav-action-button"
					onClick={() => useStory.getState().ink?.restart()}
				>
					<MdReplay size={18} />
				</button>
			</div>
			{<GameMenuModal modalRef={modalRef} type={type} title={title} />}
		</nav>
	);
};

export default memo(GameMenu);
