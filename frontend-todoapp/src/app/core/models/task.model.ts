export interface Task {
  id?: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority?: TaskPriority;
  category?: string;
  dueDate?: Date;
  createdDate?: Date;
  completedDate?: Date;
  userId?: number;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: string;
  dueDate?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: TaskPriority;
  category?: string;
  dueDate?: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completedToday: number;
}

export interface TaskFilters {
  isCompleted?: boolean;
  priority?: TaskPriority;
  category?: string;
  searchTerm?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}