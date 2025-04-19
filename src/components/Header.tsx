import React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Editboard from "./Editboard";
import Deleteboard from "./Deleteboard";
import Createtask from "./Createtask";
import { useBodyModalClass } from "./useBodyModalClass";
type ModalType = "edit" | "delete" | "create" | null;

const Header = ({
  isSidebarOpen,
  isModalOpen,
  setActiveModal,
  activeModal,
}: {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  setActiveModal: (modal: ModalType | null) => void;
  activeModal: ModalType;
}) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  const optionsRef = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const boards = useSelector((state: RootState) => state.board.boards);
  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );
  const selectedBoard = boards.find((b) => b.id === selectedBoardId);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);
  useBodyModalClass(
    activeModal === "create" ||
      activeModal === "edit" ||
      activeModal === "delete"
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {isMobile ? (
        <header className={`header  ${isModalOpen ? "modalOpen" : ""}`}>
          <div className="logoContainer">
            <Image
              width={24}
              height={25}
              alt="logo"
              src={`./assets/logo-mobile.svg`}
              className="logo"
            />
          </div>{" "}
          <h1>
            {selectedBoard?.name ? (
              selectedBoard.name
            ) : (
              <div className="boardName">
                <p>Choose A Board or create one </p>
                <Image
                  width={24}
                  height={25}
                  alt="logo"
                  src={`./assets/icon-chevron-down.svg`}
                  className="logo"
                />
              </div>
            )}
          </h1>
        </header>
      ) : (
        <header
          className={`header ${
            isSidebarOpen ? "sidebarOpen" : "sidebarClosed"
          } ${isModalOpen ? "modalOpen" : ""}`}
        >
          <div className="logoContainer">
            <Image
              width={152}
              height={26}
              alt="logo"
              src={`./assets/logo-${mode === "light" ? "dark" : "light"}.svg`}
              className="logo"
            />
          </div>
          {selectedBoard && (
            <div className="headerActions">
              <h1>{selectedBoard.name}</h1>
              <div className="btnAndMenu">
                <button
                  className="addTaskBtn"
                  onClick={() => setActiveModal("create")}
                >
                  + Add New Task
                </button>
                <div className="boardMenu" ref={optionsRef}>
                  <button onClick={() => setShowOptions(true)}>
                    <Image
                      src={"./assets/icon-vertical-ellipsis.svg"}
                      alt="ellipsis"
                      width={5}
                      height={20}
                    />
                  </button>
                  {showOptions && (
                    <div>
                      <button onClick={() => setActiveModal("edit")}>
                        Edit Board
                      </button>
                      <button
                        onClick={() => setActiveModal("delete")}
                        className="deleteBtn"
                      >
                        Delete Board
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeModal === "edit" && (
            <Editboard onClose={() => setActiveModal(null)} />
          )}
          {activeModal === "delete" && (
            <Deleteboard onClose={() => setActiveModal(null)} />
          )}
          {activeModal === "create" && (
            <Createtask onClose={() => setActiveModal(null)} />
          )}
        </header>
      )}
    </>
  );
};

export default Header;
