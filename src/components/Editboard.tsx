import React from "react";
import Modalwrapper from "./Modalwrapper";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateBoard } from "../redux/boardSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { ModalProps } from "./types";

interface EditboardProps extends ModalProps {
  onClose: () => void;
}

const Editboard: React.FC<EditboardProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );
  const board = useSelector((state: RootState) =>
    state.board.boards.find((e) => e.id === selectedBoardId)
  );
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (board) {
      setBoardName(board.name);
      setColumns(board.columns.map((col) => col.name));
    }
  }, [board]);

  const handleColumnChange = (index: number, value: string) => {
    const updated = [...columns];
    updated[index] = value;
    setColumns(updated);
  };

  const addColumns = () => {
    setColumns([...columns, ""]);
  };

  const handleUpdateBoard = () => {
    if (!selectedBoardId) return;
    if (!boardName.trim() || columns.some((col) => !col.trim())) {
      setError("Board name and columns cannot be empty.");
      return;
    }
    dispatch(
      updateBoard({
        id: selectedBoardId,
        name: boardName,
        columns,
      })
    );
    onClose();
  };
  return (
    <Modalwrapper onClose={onClose}>
      <div>
        <h3>Edit Board</h3>
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
          />
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
                placeholder={`Column ${index + 1}`}
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
        <button onClick={addColumns}>+ Add New Column</button>
        <button onClick={handleUpdateBoard}>Save Changes</button>
      </div>{" "}
      {error && <p className="error">{error}</p>}
    </Modalwrapper>
  );
};

export default Editboard;
