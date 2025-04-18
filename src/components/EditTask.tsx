import React from "react";
import Modalwrapper from "./Modalwrapper";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { updateTask } from "@/redux/boardSlice";
import { useState } from "react";
import Image from "next/image";
import { Task, Subtask, ModalProps } from "./types";
import { clearBoardError } from "@/redux/boardSlice";
import { store } from "@/redux/store";
interface EdittaskProps extends ModalProps {
  task: Task;
}

const EditTask: React.FC<EdittaskProps> = ({ onClose, task }) => {
  console.log(task);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title);
  const error = useSelector((state: RootState) => state.board.error);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks);
  const [description, setDescription] = useState(task.description);
  const handleSave = () => {
    const updatedTask = {
      ...task,
      title,
      description,
      subtasks,
    };
    console.log(updatedTask);
    dispatch(updateTask(updatedTask));
    setTimeout(() => {
      const currentError = (store.getState() as RootState).board.error;
      if (!currentError) {
        onClose();
      }
    }, 0);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "", isCompleted: false }]);
  };
  const handleSubtaskChange = (index: number, value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].title = value;
    setSubtasks(updatedSubtasks);
  };

  const removeSubtask = (index: number) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);
  };
  return (
    <Modalwrapper onClose={onClose}>
      <div className="editTask">
        <h3>Edit Task</h3>
        <div className="title">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            id="title"
            onChange={(e) => {
              if (error) dispatch(clearBoardError());
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
recharge the batteries a little."
          />
        </div>
        <div className="subtask">
          <label>Subtasks</label>
          {subtasks.length > 0
            ? subtasks.map((subtask, index) => (
                <div key={index} className="columnInput">
                  <input
                    type="text"
                    placeholder={`Subtask ${index + 1}`}
                    value={subtask.title}
                    onChange={(e) => {
                      if (error) dispatch(clearBoardError());
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
        <button onClick={addSubtask}>+ Add New Subtask</button>
        <button onClick={handleSave}>Save Changes</button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </Modalwrapper>
  );
};

export default EditTask;
