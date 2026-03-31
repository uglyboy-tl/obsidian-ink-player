import type { InkStory } from "@inkweave/core";
import type { SaveSlot } from "@inkweave/plugins";
import { memory } from "@inkweave/plugins";
import { I18n } from "locales/i18n";
import { memo } from "react";

const i18n = new I18n();
const t = (key: Parameters<typeof i18n.t>[0], vars?: Record<string, string>) => i18n.t(key, vars);

interface InkWeaveMenuModalProps {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  type: string;
  title: string;
  ink: InkStory;
}

const SLOTS = [1, 2, 3, 4, 5];

const InkWeaveMenuModal: React.FC<InkWeaveMenuModalProps> = ({ modalRef, type, title, ink }) => {
  const saves = memory.show(title);
  const autosaveEnabled = ink.options.autosave_enabled === true;

  const close = () => modalRef.current?.close();

  return (
    <dialog ref={modalRef} className="inkweave-modal">
      <div className="inkweave-modal-header">
        <span className="inkweave-modal-title">
          {type === "save" ? t("modal_save") : t("modal_restore")}
        </span>
        <button className="inkweave-modal-close" onClick={close}>
          ✕
        </button>
      </div>
      <div className="inkweave-modal-body">
        {SLOTS.map((item) => {
          const save = saves?.[item] as SaveSlot | undefined;
          const isAutosaveSlot = autosaveEnabled && item === 1;
          const isDisabled = type === "restore" ? !save : isAutosaveSlot;

          return (
            <button
              key={item}
              className="inkweave-slot"
              disabled={isDisabled}
              onClick={() => {
                if (type === "save") {
                  memory.save(item, ink);
                  close();
                } else if (save) {
                  memory.load(save.data, ink);
                  close();
                }
              }}
            >
              <span className="inkweave-slot-name">
                {isAutosaveSlot ? t("modal_autosave_slot") : t("modal_slot", { n: String(item) })}
              </span>
              <span className="inkweave-slot-timestamp">{save?.timestamp ?? t("modal_empty")}</span>
            </button>
          );
        })}
      </div>
    </dialog>
  );
};

export default memo(InkWeaveMenuModal);
