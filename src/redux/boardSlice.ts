import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Subtask {
  title: string;
  isCompleted: boolean;
}

interface Task {
  id: string | number;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}

interface Column {
  name: string;
  tasks: Task[];
}

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

interface BoardState {
  boards: Board[];
  error: null | string;
  selectedBoardId: string | null;
}
const storedBoards =
  typeof window !== "undefined" ? localStorage.getItem("boards") : null;
const initialState: BoardState = {
  boards: storedBoards ? JSON.parse(storedBoards) : [],
  selectedBoardId: storedBoards
    ? JSON.parse(storedBoards)[0]?.id || null
    : null,
  error: null,
};

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    loadBoards: (state, action: PayloadAction<Omit<Board, "id">[]>) => {
      state.boards = action.payload.map((board, index) => ({
        ...board,
        id: `board-${index}-${Date.now()}`,
      }));
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
      localStorage.setItem("boards", JSON.stringify(state.boards));
    },
    addColumn: (
      state,
      action: PayloadAction<{ boardId: string; columnName: string }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.columns.push({ name: action.payload.columnName, tasks: [] });
      }
    },
    updateBoard: (
      state,
      action: PayloadAction<{ id: string; name: string; columns: string[] }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.id);
      if (board) {
        board.name = action.payload.name;

        const updatedColumns = action.payload.columns.map((colName) => {
          const existing = board.columns.find((col) => col.name === colName);
          return {
            name: colName,
            tasks: existing ? existing.tasks : [],
          };
        });

        board.columns = updatedColumns;

        localStorage.setItem("boards", JSON.stringify(state.boards));
      }
    },
    setSelectedBoard: (state, action: PayloadAction<string>) => {
      state.selectedBoardId = action.payload;
    },
    setSelectedBoardId: (state, action: PayloadAction<string>) => {
      state.selectedBoardId = action.payload;
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((b) => b.id !== action.payload);
      if (state.selectedBoardId === action.payload) {
        state.selectedBoardId = state.boards[0]?.id || null;
      }
      localStorage.setItem("boards", JSON.stringify(state.boards));
    },
    updateTask: (state, action) => {
      const { id, title, description, subtasks, status } = action.payload;
      if (!title?.trim() || !status?.trim()) {
        state.error = "All fields are required";
        return;
      }

      const hasEmptySubtask = subtasks?.some((s: Subtask) => !s.title.trim());
      if (hasEmptySubtask) {
        state.error = "All subtasks must have a title";
        return;
      }

      for (const board of state.boards) {
        for (const column of board.columns) {
          const taskIndex = column.tasks.findIndex((task) => task.id === id);
          if (taskIndex !== -1) {
            const task = column.tasks[taskIndex];
            task.title = title.trim();
            task.description = description.trim();
            task.subtasks = subtasks.map((s: Subtask) => ({
              ...s,
              title: s.title.trim(),
            }));
            task.status = status;
            column.tasks.splice(taskIndex, 1);

            const newColumn = board.columns.find((col) => col.name === status);
            if (newColumn) {
              newColumn.tasks.push(task);
            }
            state.error = null;
            localStorage.setItem("boards", JSON.stringify(state.boards));
            return;
          }
        }
      }
      state.error = "Task not found.";
    },
    clearBoardError: (state) => {
      state.error = null;
    },
    deleteTask: (state, action: PayloadAction<string | number>) => {
      for (const board of state.boards) {
        for (const column of board.columns) {
          const taskIndex = column.tasks.findIndex(
            (task) => task.id === action.payload
          );
          if (taskIndex !== -1) {
            column.tasks.splice(taskIndex, 1);

            localStorage.setItem("boards", JSON.stringify(state.boards));
            return;
          }
        }
      }
      state.error = "Task not found.";
    },
    createTask: (state, action: PayloadAction<Task>) => {
      const { title, description, status, subtasks } = action.payload;
      console.log("Creating task with status:", status);
      console.log("Current boards:", state.boards);
      if (!title?.trim() || !status?.trim()) {
        state.error = "Title and status are required";
        return;
      }
      const hasEmptySubtask = subtasks.some((s: Subtask) => !s.title.trim());
      if (hasEmptySubtask) {
        state.error = "All subtasks must have a title";
        return;
      }
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        status: status.trim(),
        subtasks: subtasks.map((s: Subtask) => ({
          ...s,
          title: s.title.trim(),
        })),
      };
      const board = state.boards.find((b) =>
        b.columns.some((col) => col.name === status)
      );
      console.log("Found board:", board);

      if (board) {
        const column = board.columns.find((col) => col.name === status);
        console.log("Found column:", column);

        if (column) {
          column.tasks.push(newTask);
        } else {
          state.error = `Column with status ${status} not found in board ${board.name}`;
          return;
        }
      } else {
        state.error = `Board containing column with status ${status} not found`;
        return;
      }
      localStorage.setItem("boards", JSON.stringify(state.boards));
      state.error = null;
    },
  },
});

export const {
  addBoard,
  addColumn,
  loadBoards,
  updateBoard,
  setSelectedBoard,
  setSelectedBoardId,
  deleteBoard,
  updateTask,
  clearBoardError,
  deleteTask,
  createTask,
} = boardSlice.actions;
export default boardSlice.reducer;
