import type { InkStory } from "@inkweave/core";
import { memo, useCallback, useRef, useState } from "react";
import { MdReplay, MdRestore, MdSave } from "react-icons/md";
import InkWeaveMenuModal from "./InkWeaveMenuModal";

interface InkWeaveMenuProps {
  ink: InkStory;
}

const InkWeaveMenu: React.FC<InkWeaveMenuProps> = ({ ink }) => {
  const [type, setType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = useCallback(
    (modalType: string) => {
      if (modalRef.current && modalType) {
        setTitle(ink.title);
        modalRef.current.showModal();
      }
      setType(modalType);
    },
    [ink],
  );

  return (
    <nav className="view-header">
      <div className="view-header-title-container mod-at-start mod-fade"></div>
      <div className="view-actions">
        <button className="clickable-icon nav-action-button" onClick={() => openModal("restore")}>
          <MdRestore size={18} />
        </button>
        <button className="clickable-icon nav-action-button" onClick={() => openModal("save")}>
          <MdSave size={18} />
        </button>
        <button className="clickable-icon nav-action-button" onClick={() => ink.restart()}>
          <MdReplay size={18} />
        </button>
      </div>
      <InkWeaveMenuModal modalRef={modalRef} type={type} title={title} ink={ink} />
    </nav>
  );
};

export default memo(InkWeaveMenu);
