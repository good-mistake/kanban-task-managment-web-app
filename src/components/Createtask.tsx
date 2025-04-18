import React from "react";
import Modalwrapper from "./Modalwrapper";
import { ModalProps } from "./types";
import { createTask } from "@/redux/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useMemo } from "react";
import Customselect from "./Customselect";
import { RootState } from "@/redux/store";
type CreatetaskProps = ModalProps;

const Createtask: React.FC<CreatetaskProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([{ title: "", isCompleted: false }]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedBoard = useSelector((state: RootState) => {
    const boardId = state.board.selectedBoardId;
    return state.board.boards.find((b) => b.id === boardId);
  });
  const columns = useMemo(() => {
    return selectedBoard?.columns.map((col) => col.name) || [];
  }, [selectedBoard]);
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumn(columns[0]);
    }
  }, [columns]);

  const handleCreateTask = () => {
    if (!title.trim() || columns.some((col) => !col.trim())) {
      setError("Board name and columns cannot be empty.");
      return;
    }
    if (!selectedColumn) {
      setError("Please select a column");
      return;
    }
    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: selectedColumn,
      subtasks,
    };

    dispatch(createTask({ ...task }));
    onClose();
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "", isCompleted: false }]);
  };
  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = value;
    setSubtasks(newSubtasks);
  };
  const removeSubtask = (index: number) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };
  const handleColumnChange = (newColumn: string) => {
    setSelectedColumn(newColumn);
  };

  return (
    <Modalwrapper onClose={onClose}>
      <div className="editTask">
        <h3>Add New Task</h3>
        <div className="title">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            id="title"
            placeholder="e.g. Take coffee break"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            style={{
              borderColor:
                !title.trim() && error
                  ? "rgb(234, 85, 85)"
                  : "rgba(130,143,163,0.25)",
            }}
          />{" "}
          {!title.trim() && error && (
            <p
              className="errorWord"
              style={{ color: "red", fontSize: "12px" }}
            >{`Can't be empty`}</p>
          )}
        </div>
        <div className="desc">
          <label htmlFor="desc">Description</label>{" "}
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little.."
          />
        </div>
        <div className="subtask">
          <label>Subtasks</label>
          {subtasks.length > 0
            ? subtasks.map((subtask, index) => (
                <div key={index} className="columnInput">
                  <input
                    type="text"
                    placeholder={
                      index < 3
                        ? [
                            "e.g. Make coffee",
                            "e.g. Drink coffee & smile",
                            "Done",
                          ][index]
                        : `Subtask ${index + 1}`
                    }
                    value={subtask.title}
                    onChange={(e) => {
                      handleSubtaskChange(index, e.target.value);
                    }}
                    style={{
                      borderColor:
                        !subtask.title.trim() && error
                          ? "rgb(234, 85, 85)"
                          : "rgba(130,143,163,0.25)",
                    }}
                  />{" "}
                  {!subtask.title.trim() && error && (
                    <p
                      className="errorWord"
                      style={{ color: "red", fontSize: "12px" }}
                    >{`Can't be empty`}</p>
                  )}
                  <button
                    type="button"
                    className="removeBtn"
                    onClick={() => removeSubtask(index)}
                  >
                    <Image
                      src={"./assets/icon-cross.svg"}
                      alt="cancel"
                      width={15}
                      height={15}
                    ></Image>
                  </button>
                </div>
              ))
            : ""}
        </div>
        <button onClick={addSubtask}>+ Add New Subtask</button>{" "}
        <div className="customWrapper">
          <p>status</p>{" "}
          <Customselect
            value={selectedColumn}
            options={columns}
            onChange={handleColumnChange}
          />
        </div>
        <button onClick={handleCreateTask}>Save Changes</button>
      </div>
      {error && <p className="error">{error}</p>}
    </Modalwrapper>
  );
};

export default Createtask;
