export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string | number;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}
export interface Column {
  name: string;
  tasks: Task[];
}
export interface ModalProps {
  onClose: () => void;
}
export interface Board {
  id: string;
  name: string;
  columns: Column[];
}
export interface BoardState {
  boards: Board[];
  error: null | string;
  selectedBoardId: string | null;
}
