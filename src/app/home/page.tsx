"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useBodyModalClass } from "@/components/useBodyModalClass";
import Detail from "@/components/Detail";
import Createboard from "@/components/Createboard";
import { Task } from "@/components/types";
import Editboard from "@/components/Editboard";
const Page = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );
  const board = useSelector((state: RootState) =>
    state.board.boards.find((e) => e.id === selectedBoardId)
  );

  useBodyModalClass(showInfoModal || showCreateBoard || showEditBoard);
  return (
    <>
      {board ? (
        <div key={board.id} className="boards">
          {board.columns && board.columns.length > 0 ? (
            <>
              <div>
                {board.columns.map((column) => (
                  <div key={column.name} className="col">
                    <div className="colName">
                      <div
                        style={{
                          backgroundColor:
                            column.name.toLocaleUpperCase() === "TODO"
                              ? "#49C4E5"
                              : column.name.toLocaleUpperCase() === "DOING"
                              ? "#8471F2"
                              : column.name.toLocaleUpperCase() === "DONE"
                              ? "#67E2AE"
                              : "#" +
                                Math.floor(Math.random() * 16777215).toString(
                                  16
                                ),
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          marginRight: "8px",
                        }}
                      />
                      {column.name.toLocaleUpperCase()}{" "}
                      {`(${column.tasks.length})`}
                    </div>
                    <div className="tasks">
                      {column.tasks.map((task) => {
                        return (
                          <div
                            key={task.title}
                            className="task"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowInfoModal(true);
                            }}
                          >
                            <h3>{task.title}</h3>
                            {task.subtasks && (
                              <p className="tasksCom">
                                {
                                  task.subtasks.filter((sub) => sub.isCompleted)
                                    .length
                                }{" "}
                                of {task.subtasks.length} subtasks
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="col emptyColumn"
                onClick={() => setShowEditBoard(true)}
              >
                <div className="tasks">
                  <div className="task">
                    <button>+ Add New Column</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="emptyColumn">
              <p>This board is empty. Create a new column to get started.</p>
              <button>+ Add New Column</button>
            </div>
          )}
        </div>
      ) : (
        <div className="noBoard">
          <p>Select a Board or </p>
          <button onClick={() => setShowCreateBoard(true)}>
            <p>Create A New Board</p>
          </button>
          {showCreateBoard && (
            <Createboard onClose={() => setShowCreateBoard(false)} />
          )}
        </div>
      )}
      {showInfoModal && selectedTask && (
        <Detail
          columns={board!.columns}
          task={selectedTask}
          onClose={() => setShowInfoModal(false)}
        />
      )}{" "}
      {showEditBoard && <Editboard onClose={() => setShowEditBoard(false)} />}
    </>
  );
};

export default Page;
