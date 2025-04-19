import React from "react";
import Modalwrapper from "./Modalwrapper";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { updateTask } from "@/redux/boardSlice";
import Customselect from "./Customselect";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import { createPortal } from "react-dom";
import { Task, Column, ModalProps } from "./types";
import { useIsMobile } from "./useIsMobile";
interface DetailProps extends ModalProps {
  task: Task;
  columns: Column[];
}

const Detail: React.FC<DetailProps> = ({ onClose, task, columns }) => {
  const [status, setStatus] = useState(task.status);
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });
  const isMobile = useIsMobile();
  const [activeModal, setActiveModal] = useState<"detail" | "edit" | "delete">(
    "detail"
  );

  const optionsRef = useRef<HTMLDivElement>(null);

  const [subtasks, setSubtasks] = useState(task.subtasks);

  const dispatch = useDispatch();

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleSubtaskChange = (index: number) => {
    const updatedSubtasks = subtasks.map((subtask, i) =>
      i === index ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask
    );
    setSubtasks(updatedSubtasks);
  };

  const handleClose = () => {
    if (
      JSON.stringify(subtasks) !== JSON.stringify(task.subtasks) ||
      status !== task.status
    ) {
      dispatch(updateTask({ ...task, subtasks, status }));
    }
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);
  const toggleOptions = () => {
    if (!showOptions && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY + 14,
        left: rect.right - 90 + window.scrollX,
      });
    }
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (buttonRef.current && showOptions) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyle({
          top: isMobile
            ? rect.bottom + window.scrollY - 10
            : rect.bottom + window.scrollY + 14,
          left: isMobile
            ? rect.right - 210 + window.scrollX
            : rect.right - 110 + window.scrollX,
        });
      }
    };
    if (showOptions) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [showOptions]);
  if (activeModal === "edit") {
    return <EditTask onClose={onClose} task={task} />;
  }
  if (activeModal === "delete") {
    return <DeleteTask onClose={onClose} task={task} />;
  }
  console.log(columns);
  return (
    <Modalwrapper onClose={handleClose}>
      <div className="details">
        <div className="title">
          <h2>{task.title}</h2>
          <button onClick={toggleOptions} ref={buttonRef}>
            <Image
              src={"./assets/icon-vertical-ellipsis.svg"}
              alt="ellipsis"
              width={8}
              height={20}
            />
          </button>
          {createPortal(
            <div
              className={`optionsShow ${showOptions ? "visible" : ""}`}
              ref={optionsRef}
              style={{
                pointerEvents: showOptions ? "auto" : "none",
                top: `${dropdownStyle.top}px`,
                left: `${dropdownStyle.left}px`,
              }}
            >
              <button onClick={() => setActiveModal("edit")}>Edit Task</button>
              <button
                onClick={() => setActiveModal("delete")}
                className="deleteBtn"
              >
                Delete Task
              </button>
            </div>,
            document.getElementById("modal-root")!
          )}
        </div>
        <p>{task.description}</p>
        <div className="subtask">
          <div>
            Subtasks ( {subtasks.filter((sub) => sub.isCompleted).length}
            {` `}of {` `}
            {subtasks.length})
          </div>
          <ul>
            {subtasks.map((subtask, index) => (
              <li key={index} onClick={() => handleSubtaskChange(index)}>
                <input type="checkbox" checked={subtask.isCompleted} readOnly />
                <div> {subtask.title}</div>
              </li>
            ))}
          </ul>
        </div>
        <label htmlFor="select">
          <div>Current Status</div>

          <Customselect
            value={status}
            options={columns.map((col) => col.name)}
            onChange={handleStatusChange}
          />
        </label>
      </div>
    </Modalwrapper>
  );
};

export default Detail;
