import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { useBodyModalClass } from "./useBodyModalClass";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import Image from "next/image";
import initialData from "../../data.json";
import { loadBoards } from "@/redux/boardSlice";
import { setSelectedBoardId } from "@/redux/boardSlice";
import Createboard from "./Createboard";
const Sidebar = ({
  toggleSidebar,
  isSidebarOpen,
  isModalOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isModalOpen: boolean;
}) => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const boards = useSelector((state: RootState) => state.board.boards);
  const [showModal, setShowModal] = useState(false);

  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );

  const numberOfBoards = boards.length;
  useEffect(() => {
    const stored = localStorage.getItem("boards");
    if (stored) {
      dispatch(loadBoards(JSON.parse(stored)));
    } else {
      const boardsWithIds = initialData.boards.map((board) => ({
        name: board.name,
        columns: board.columns.map((column) => ({
          name: column.name,
          tasks: column.tasks.map((task) => ({
            ...task,
            id: crypto.randomUUID(),
            status: task.status,
          })),
        })),
      }));

      dispatch(loadBoards(boardsWithIds));
      localStorage.setItem("boards", JSON.stringify(boardsWithIds));
    }
  }, [dispatch]);
  useBodyModalClass(showModal);
  return (
    <aside
      className={`sidebar ${isSidebarOpen ? "" : "collapsed"} ${
        isModalOpen ? "modalOpen" : ""
      }`}
    >
      {isSidebarOpen ? (
        <>
          <div>
            <div>
              <Image
                width={152}
                height={26}
                alt="logo"
                src={`./assets/logo-${mode === "light" ? "dark" : "light"}.svg`}
                className="logo"
              />
            </div>
            {boards.length > 0 ? (
              <ul>
                <li>ALL BOARDS ({numberOfBoards})</li>
                {boards.map((board) => (
                  <li
                    key={board.id || crypto.randomUUID()}
                    className={selectedBoardId === board.id ? "active" : ""}
                    onClick={() => dispatch(setSelectedBoardId(board.id))}
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
                ))}
                <li onClick={() => setShowModal(true)}>
                  <Image
                    width={16}
                    height={16}
                    alt="logo"
                    src={`./assets/icon-board.svg`}
                    className="logo"
                  />
                  Create New Board
                </li>
                {showModal && (
                  <Createboard onClose={() => setShowModal(false)} />
                )}
              </ul>
            ) : (
              <ul>
                <li> Create a board and see it here </li>
                <li onClick={() => setShowModal(true)}>
                  <Image
                    width={16}
                    height={16}
                    alt="logo"
                    src={`./assets/icon-board.svg`}
                    className="logo"
                  />
                  Create New Board
                </li>{" "}
                {showModal && (
                  <Createboard onClose={() => setShowModal(false)} />
                )}
              </ul>
            )}
          </div>

          <div className="bottomSidebar">
            <div className="themeContainer">
              <Image
                src={"./assets/icon-light-theme.svg"}
                width={19}
                height={18}
                alt="light"
              />
              <div
                className={`themeSwitch ${mode === "dark" ? "dark" : ""}`}
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
            </div>
            <div>
              <button onClick={toggleSidebar} className="sidebarToggle">
                <Image
                  src={`./assets/icon-hide-sidebar.svg`}
                  width={18}
                  height={16}
                  alt="showsidebar"
                />
                <p>Hide Sidebar</p>
              </button>
            </div>
          </div>
        </>
      ) : (
        <button className="collapsedBtn" onClick={toggleSidebar}>
          <Image
            src={`./assets/icon-show-sidebar.svg`}
            width={16}
            height={10}
            alt="showsidebar"
          />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
