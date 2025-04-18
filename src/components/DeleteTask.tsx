import React from "react";
import Modalwrapper from "./Modalwrapper";
import { Task, ModalProps } from "./types";
import { useDispatch } from "react-redux";
import { deleteTask } from "@/redux/boardSlice";
interface DeletetaskProps extends ModalProps {
  task: Task;
}

const DeleteTask: React.FC<DeletetaskProps> = ({ onClose, task }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    onClose();
  };
  return (
    <Modalwrapper onClose={onClose}>
      <div className="deleteTask">
        <h3>Delete this task?</h3>
        <p>
          Are you sure you want to delete the ‘{task.title}’ task and its
          subtasks? This action cannot be reversed.
        </p>
        <div className="btns">
          <button className="removeBtn" onClick={handleDelete}>
            Delete
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modalwrapper>
  );
};

export default DeleteTask;
