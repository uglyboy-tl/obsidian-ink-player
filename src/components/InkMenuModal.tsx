import { memo, useState } from "react";
import { useStory } from "@/hooks";
import memory from "@/lib/patches/memory";

interface GameMenuModalProps {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	type: string;
	title: string;
}

const GameMenuModal: React.FC<GameMenuModalProps> = ({
	modalRef,
	type,
	title,
}) => {
	const [refresh, setRefresh] = useState(false); // 用于触发重新渲染的标记状态
	const button = [0, 1, 2];
	const saves = memory.show(title);
	return (
		<dialog ref={modalRef} className={"modal"}>
			<div className="modal-header">
				<div className="modal-title">
					{type === "save" ? "Save" : "Restore"}
				</div>
			</div>
			<form method="dialog">
				<button className="modal-close-button"></button>
				<div className="mocal-content prompt-results">
					{button.map((item) => (
						<div
							key={`${item}`}
							className="suggestion-item mod-complex"
						>
							<button
								className="suggestion-content"
								onClick={() => {
									const ink = useStory.getState().ink;
									if (!ink) return;
									if (type === "save") {
										memory.save(item, ink);
										setRefresh(!refresh);
									} else if (
										type === "restore" &&
										saves &&
										saves[item]
									) {
										memory.load(saves[item].data, ink);
									}
								}}
							>
								存档 {item + 1}
							</button>
							<div className="suggestion-aux">
								{saves
									? saves[item]?.timestamp || "empty"
									: "empty"}
							</div>
						</div>
					))}
				</div>
			</form>
		</dialog>
	);
};

export default memo(GameMenuModal);
