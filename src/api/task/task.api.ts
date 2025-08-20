import axios from "axios";
import type { NewTask, UpdateTaskStatus } from "./task.dto";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Get all tasks
export const getTasks = () => axios.get(`${API}/tasks`);

// Add a new task
export const addTask = (task: NewTask) => axios.post(`${API}/tasks`, task);

// Update task status
export const updateTaskStatus = (id: number, dto: UpdateTaskStatus) =>
  axios.put(`${API}/tasks/${id}`, dto);

// Delete a task
export const deleteTask = (id: number) => axios.delete(`${API}/tasks/${id}`);
