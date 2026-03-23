import { memo } from "react";
import { useStory } from "@/hooks";
import memory from "@/lib/patches/memory";
import useStorage from "@/lib/patches/storage";
import { I18n } from "locales/i18n";

const i18n = new I18n();
const t = (key: Parameters<typeof i18n.t>[0], vars?: Record<string, string>) =>
	i18n.t(key, vars);

interface GameMenuModalProps {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	type: string;
	title: string;
}

const SLOTS = [0, 1, 2];

const GameMenuModal: React.FC<GameMenuModalProps> = ({
	modalRef,
	type,
	title,
}) => {
	const storage = useStorage((s) => s.storage);
	const saves = storage.get(title);

	const close = () => modalRef.current?.close();

	return (
		<dialog ref={modalRef} className="ink-modal">
			<div className="ink-modal-header">
				<span className="ink-modal-title">
					{type === "save" ? t("modal_save") : t("modal_restore")}
				</span>
				<button className="ink-modal-close" onClick={close}>✕</button>
			</div>
			<div className="ink-modal-body">
				{SLOTS.map((item) => {
					const save = saves?.[item];
					const isDisabled = type === "restore" && !save;

					return (
						<button
							key={item}
							className="ink-slot"
							disabled={isDisabled}
							onClick={() => {
								const ink = useStory.getState().ink;
								if (!ink) return;
								if (type === "save") {
									memory.save(item, ink);
									close();
								} else if (save) {
									memory.load(save.data, ink);
									close();
								}
							}}
						>
							<span className="ink-slot-name">
								{t("modal_slot", { n: String(item + 1) })}
							</span>
							<span className="ink-slot-timestamp">
								{save?.timestamp ?? t("modal_empty")}
							</span>
						</button>
					);
				})}
			</div>
		</dialog>
	);
};

export default memo(GameMenuModal);
