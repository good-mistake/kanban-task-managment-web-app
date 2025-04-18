import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBoard } from "../redux/boardSlice";
import Image from "next/image";
import Modalwrapper from "./Modalwrapper";
import { ModalProps } from "./types";
type CreateboardProps = ModalProps;

const Createboard: React.FC<CreateboardProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState(["", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const addColumns = () => {
    setColumns([...columns, ""]);
  };
  const handleColumnChange = (index: number, value: string) => {
    const updated = [...columns];
    updated[index] = value;
    setColumns(updated);
  };
  const handleCreateBoard = () => {
    if (!boardName.trim() || columns.some((col) => !col.trim())) {
      setError("Board name and columns cannot be empty.");
      return;
    }
    const boardData = {
      id: `board-${Date.now()}`,
      name: boardName,
      columns: columns.map((name) => ({
        name,
        tasks: [],
      })),
    };

    dispatch(addBoard(boardData));
    onClose();
  };

  return (
    <Modalwrapper onClose={onClose}>
      <div>
        {" "}
        <h3>Add New Board</h3>
        <div className="name">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="e.g. Web Design"
            value={boardName}
            id="name"
            onChange={(e) => setBoardName(e.target.value)}
            style={{
              borderColor:
                !boardName.trim() && error
                  ? "rgb(234, 85, 85)"
                  : "rgba(130,143,163,0.25)",
            }}
          />{" "}
          {!boardName.trim() && error && (
            <p
              className="errorWord"
              style={{ color: "red", fontSize: "12px" }}
            >{`Can't be empty`}</p>
          )}
        </div>
        <div>
          <label htmlFor="column">Columns</label>
          {columns.map((col, index) => (
            <div key={index} className="columnInput">
              <input
                type="text"
                placeholder={
                  index < 3
                    ? ["Todo", "Doing", "Done"][index]
                    : `Column ${index + 1}`
                }
                value={col}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                style={{
                  borderColor:
                    !col.trim() && error
                      ? "rgb(234, 85, 85)"
                      : "rgba(130,143,163,0.25)",
                }}
              />{" "}
              {!col.trim() && error && (
                <p
                  className="errorWord"
                  style={{ color: "red", fontSize: "12px" }}
                >{`Can't be empty`}</p>
              )}
              <button
                type="button"
                className="removeBtn"
                onClick={() => {
                  const updated = [...columns];
                  updated.splice(index, 1);
                  setColumns(updated);
                }}
              >
                <Image
                  src={"./assets/icon-cross.svg"}
                  alt="cancel"
                  width={15}
                  height={15}
                ></Image>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addColumns}>+ Add New Column</button>{" "}
        <button onClick={handleCreateBoard}>Create New Board</button>{" "}
        {error && <p className="error">{error}</p>}
      </div>
    </Modalwrapper>
  );
};

export default Createboard;
