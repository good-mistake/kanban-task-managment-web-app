import React from "react";
import { ModalProps } from "./types";
interface ModalWrapperProps extends ModalProps {
  children: React.ReactNode;
}
const Modalwrapper: React.FC<ModalWrapperProps> = ({ onClose, children }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modalContent">{children}</div>
    </div>
  );
};

export default Modalwrapper;
