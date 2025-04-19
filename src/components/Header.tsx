import React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Editboard from "./Editboard";
import Deleteboard from "./Deleteboard";
import Createtask from "./Createtask";
import { useBodyModalClass } from "./useBodyModalClass";
import Createboard from "./Createboard";
import { setSelectedBoardId } from "@/redux/boardSlice";
import { useDispatch } from "react-redux";
import { useIsMobile } from "./useIsMobile";
import { toggleTheme } from "@/redux/themeSlice";
import Modalwrapper from "./Modalwrapper";

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
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isMobile = useIsMobile();
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const boardNameRef = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showNameOptions, setShowNameOptions] = useState(false);

  const boards = useSelector((state: RootState) => state.board.boards);
  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );
  const selectedBoard = boards.find((b) => b.id === selectedBoardId);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (boardNameRef.current && !boardNameRef.current.contains(target)) {
        setShowNameOptions(false);
      }

      if (optionsMenuRef.current && !optionsMenuRef.current.contains(target)) {
        setShowOptions(false);
      }
    };

    if (showOptions || showNameOptions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showOptions, showNameOptions]);

  useBodyModalClass(
    activeModal === "create" ||
      activeModal === "edit" ||
      activeModal === "delete"
  );

  return (
    <>
      {isMobile ? (
        <header className={`headerMobile  ${isModalOpen ? "modalOpen" : ""}`}>
          <div className="left">
            {" "}
            <div className="logoContainer">
              <Image
                width={24}
                height={25}
                alt="logo"
                src={`./assets/logo-mobile.svg`}
                className="logo"
              />
            </div>
            <h1>
              <div className="boardName" ref={boardNameRef}>
                <div onClick={() => setShowNameOptions((prev) => !prev)}>
                  <p>
                    {selectedBoard?.name
                      ? selectedBoard?.name
                      : "Choose A Board"}
                  </p>
                  <Image
                    width={16}
                    height={8}
                    alt="logo"
                    src={`./assets/icon-chevron-down.svg`}
                    className="logo"
                  />
                </div>
                {showNameOptions && (
                  <Modalwrapper onClose={() => setShowNameOptions(false)}>
                    <div
                      className={` ${showNameOptions ? "Open" : "Closed"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ul>
                        <li>ALL BOARDS ({boards.length})</li>
                        {boards.map((board) => {
                          return (
                            <li
                              key={board.id}
                              onClick={() => {
                                dispatch(setSelectedBoardId(board.id));
                                setShowNameOptions(false);
                              }}
                              className={
                                selectedBoardId === board.id
                                  ? "active  nameAndImg"
                                  : " nameAndImg"
                              }
                            >
                              <Image
                                width={16}
                                height={16}
                                alt="logo"
                                src={`./assets/icon-board.svg`}
                                className="logo"
                              />
                              {board.name}
                            </li>
                          );
                        })}
                        <li
                          className="createBoard"
                          onClick={() => setShowCreateBoardModal(true)}
                        >
                          <Image
                            width={16}
                            height={16}
                            alt="logo"
                            src={`./assets/icon-board.svg`}
                            className="logo"
                          />
                          Create New Board
                        </li>
                        <li className="themeContainer">
                          <Image
                            src={"./assets/icon-light-theme.svg"}
                            width={19}
                            height={18}
                            alt="light"
                          />
                          <div
                            className={`themeSwitch ${
                              mode === "dark" ? "dark" : ""
                            }`}
                            onClick={() => dispatch(toggleTheme())}
                          >
                            <button className="switchHandle"></button>
                          </div>
                          <Image
                            src={"./assets/icon-dark-theme.svg"}
                            width={15}
                            height={15}
                            alt="dark"
                          />
                        </li>
                      </ul>
                    </div>
                  </Modalwrapper>
                )}
              </div>
            </h1>
          </div>
          <div className="right">
            {selectedBoard && (
              <div className="headerActions">
                <div className="btnAndMenu">
                  <button
                    className="addTaskBtn"
                    onClick={() => setActiveModal("create")}
                  >
                    <Image
                      src={"./assets/icon-add-task-mobile.svg"}
                      alt="ellipsis"
                      width={12}
                      height={12}
                    />{" "}
                  </button>
                  <div className="boardMenu" ref={optionsMenuRef}>
                    <button onClick={() => setShowOptions((prev) => !prev)}>
                      <Image
                        src={"./assets/icon-vertical-ellipsis.svg"}
                        alt="ellipsis"
                        width={4}
                        height={16}
                      />
                    </button>
                    <div
                      className={`mobileName ${
                        showOptions ? "Open" : "Closed"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
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
                  </div>
                </div>
              </div>
            )}
          </div>
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
                <div className="boardMenu" ref={optionsMenuRef}>
                  <button onClick={() => setShowOptions((prev) => !prev)}>
                    <Image
                      src={"./assets/icon-vertical-ellipsis.svg"}
                      alt="ellipsis"
                      width={5}
                      height={20}
                    />
                  </button>
                  {showOptions && (
                    <div onClick={(e) => e.stopPropagation()}>
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
        </header>
      )}
      {activeModal === "edit" && (
        <Editboard onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "delete" && (
        <Deleteboard onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "create" && (
        <Createtask onClose={() => setActiveModal(null)} />
      )}{" "}
      {showCreateBoardModal && (
        <Createboard onClose={() => setShowCreateBoardModal(false)} />
      )}
    </>
  );
};

export default Header;
