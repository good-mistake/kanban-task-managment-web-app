import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Modalwrapper from "./Modalwrapper";
import { deleteBoard } from "@/redux/boardSlice";
import { ModalProps } from "./types";

type deleteProps = ModalProps;

const Deleteboard: React.FC<deleteProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );
  const board = useSelector((state: RootState) =>
    state.board.boards.find((e) => e.id === selectedBoardId)
  );
  if (!board) return null;
  const handleDeleteBoard = () => {
    dispatch(deleteBoard(board.id));
    onClose();
  };
  return (
    <Modalwrapper onClose={onClose}>
      <div className="deleteTask">
        <h3>Delete this board?</h3>
        <p>
          Are you sure you want to delete the ‘{board.name}’ board? This action
          will remove all columns and tasks and cannot be reversed.
        </p>
        <div className="btns">
          <button className="removeBtn" onClick={handleDeleteBoard}>
            Delete
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modalwrapper>
  );
};

export default Deleteboard;
