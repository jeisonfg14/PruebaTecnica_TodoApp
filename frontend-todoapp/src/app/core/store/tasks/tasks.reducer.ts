import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TodoTask, TaskStatistics, TaskFilter } from '../../models';
import * as TasksActions from './tasks.actions';

export interface TasksState extends EntityState<TodoTask> {
  selectedTaskId: number | null;
  filter: TaskFilter;
  statistics: TaskStatistics | null;
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<TodoTask> = createEntityAdapter<TodoTask>({
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export const initialState: TasksState = adapter.getInitialState({
  selectedTaskId: null,
  filter: { page: 1, pageSize: 10 },
  statistics: null,
  isLoading: false,
  error: null,
});

export const tasksReducer = createReducer(
  initialState,
  
  // Load Tasks
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(TasksActions.loadTasksSuccess, (state, { tasks }) =>
    adapter.setAll(tasks, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),
  
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Load Single Task
  on(TasksActions.loadTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(TasksActions.loadTaskSuccess, (state, { task }) =>
    adapter.upsertOne(task, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),
  
  on(TasksActions.loadTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Create Task
  on(TasksActions.createTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(TasksActions.createTaskSuccess, (state, { task }) =>
    adapter.addOne(task, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),
  
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Update Task
  on(TasksActions.updateTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(TasksActions.updateTaskSuccess, (state, { task }) =>
    adapter.updateOne({ id: task.id, changes: task }, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),
  
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Delete Task
  on(TasksActions.deleteTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(TasksActions.deleteTaskSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      isLoading: false,
      error: null,
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    })
  ),
  
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Toggle Task
  on(TasksActions.toggleTask, (state) => ({
    ...state,
    error: null,
  })),
  
  on(TasksActions.toggleTaskSuccess, (state, { task }) =>
    adapter.updateOne({ id: task.id, changes: task }, {
      ...state,
      error: null,
    })
  ),
  
  on(TasksActions.toggleTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  // Load Statistics
  on(TasksActions.loadStatistics, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(TasksActions.loadStatisticsSuccess, (state, { statistics }) => ({
    ...state,
    statistics,
    isLoading: false,
    error: null,
  })),
  
  on(TasksActions.loadStatisticsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  // Set Filter
  on(TasksActions.setFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter },
  })),
  
  // Select Task
  on(TasksActions.selectTask, (state, { id }) => ({
    ...state,
    selectedTaskId: id,
  })),
  
  // Clear Error
  on(TasksActions.clearTasksError, (state) => ({
    ...state,
    error: null,
  }))
);

// Export entity selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();