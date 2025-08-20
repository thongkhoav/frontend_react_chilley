export interface NewTask {
  title: string;
  description: string;
}

export interface UpdateTaskStatus {
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
