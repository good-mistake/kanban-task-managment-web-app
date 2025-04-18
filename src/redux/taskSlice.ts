import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface Subtask {
  title: string;
  isCompleted: boolean;
}
const storedTasks =
  typeof window !== "undefined" ? localStorage.getItem("tasks") : null;

interface Task {
  id: string | number;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
}

const initialState: TaskState = {
  tasks: storedTasks ? JSON.parse(storedTasks) : [],
  selectedTask: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },
    createTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    deleteTask: (state, action: PayloadAction<string | number>) => {
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
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string | number; status: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },
  },
});

export const {
  setTasks,
  createTask,
  deleteTask,
  selectTask,
  setSelectedTask,
  clearSelectedTask,
  updateTaskStatus,
} = taskSlice.actions;

export default taskSlice.reducer;
