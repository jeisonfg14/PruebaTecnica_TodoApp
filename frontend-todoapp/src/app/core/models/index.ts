// Core interfaces and models
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
}

export interface TodoTask {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
  priority: number;
  userId: number;
}

export interface CreateTodoTask {
  title: string;
  description?: string;
  priority: number;
}

export interface UpdateTodoTask {
  title?: string;
  description?: string;
  priority?: number;
  isCompleted?: boolean;
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  tasksCreatedToday: number;
  tasksCompletedToday: number;
}

export interface TaskFilter {
  isCompleted?: boolean;
  priority?: number;
  createdAfter?: string;
  createdBefore?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface AuthResponse {
  token: string;
  expires: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}