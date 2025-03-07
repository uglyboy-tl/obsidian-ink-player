import { memo, useState } from "react";
import { useSave, useStory } from "@/hooks";

interface GameMenuModalProps {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	type: string;
}

const GameMenuModal: React.FC<GameMenuModalProps> = ({ modalRef, type }) => {
	const [refresh, setRefresh] = useState(false); // 用于触发重新渲染的标记状态
	const getSaves = useSave.use.getSaves();
	const button = [0, 1, 2];
	const save = getSaves();
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
									if (type === "save") {
										useStory.getState().save(item);
										setRefresh(!refresh);
									} else if (
										type === "restore" &&
										save &&
										save[item]
									) {
										useStory
											.getState()
											.load(save[item].data);
									}
								}}
							>
								存档 {item + 1}
							</button>
							<div className="suggestion-aux">
								{save
									? save[item]?.timestamp || "empty"
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
