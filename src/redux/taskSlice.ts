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
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setSelectedTask: (state) => {
      state.selectedTask = null;
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
