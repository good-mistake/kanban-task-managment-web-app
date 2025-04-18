import { useEffect } from "react";

export const useBodyModalClass = (isAnyModalOpen: boolean) => {
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isAnyModalOpen]);
};
