import { createAction, props } from '@ngrx/store';
import { TodoTask, CreateTodoTask, UpdateTodoTask, TaskStatistics, TaskFilter } from '../../models';

// Task Actions
export const loadTasks = createAction(
  '[Tasks] Load Tasks',
  props<{ filter?: TaskFilter }>()
);

export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: TodoTask[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);

export const loadTask = createAction(
  '[Tasks] Load Task',
  props<{ id: number }>()
);

export const loadTaskSuccess = createAction(
  '[Tasks] Load Task Success',
  props<{ task: TodoTask }>()
);

export const loadTaskFailure = createAction(
  '[Tasks] Load Task Failure',
  props<{ error: string }>()
);

export const createTask = createAction(
  '[Tasks] Create Task',
  props<{ task: CreateTodoTask }>()
);

export const createTaskSuccess = createAction(
  '[Tasks] Create Task Success',
  props<{ task: TodoTask }>()
);

export const createTaskFailure = createAction(
  '[Tasks] Create Task Failure',
  props<{ error: string }>()
);

export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ id: number; updates: UpdateTodoTask }>()
);

export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: TodoTask }>()
);

export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: number }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: number }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);

export const toggleTask = createAction(
  '[Tasks] Toggle Task',
  props<{ id: number }>()
);

export const toggleTaskSuccess = createAction(
  '[Tasks] Toggle Task Success',
  props<{ task: TodoTask }>()
);

export const toggleTaskFailure = createAction(
  '[Tasks] Toggle Task Failure',
  props<{ error: string }>()
);

export const loadStatistics = createAction('[Tasks] Load Statistics');

export const loadStatisticsSuccess = createAction(
  '[Tasks] Load Statistics Success',
  props<{ statistics: TaskStatistics }>()
);

export const loadStatisticsFailure = createAction(
  '[Tasks] Load Statistics Failure',
  props<{ error: string }>()
);

export const setFilter = createAction(
  '[Tasks] Set Filter',
  props<{ filter: TaskFilter }>()
);

export const clearTasksError = createAction('[Tasks] Clear Error');

export const selectTask = createAction(
  '[Tasks] Select Task',
  props<{ id: number | null }>()
);