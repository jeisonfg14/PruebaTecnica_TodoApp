import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, selectAll, selectEntities } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  selectAll
);

export const selectTasksEntities = createSelector(
  selectTasksState,
  selectEntities
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.isLoading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state) => state.error
);

export const selectSelectedTaskId = createSelector(
  selectTasksState,
  (state) => state.selectedTaskId
);

export const selectSelectedTask = createSelector(
  selectTasksEntities,
  selectSelectedTaskId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectTasksFilter = createSelector(
  selectTasksState,
  (state) => state.filter
);

export const selectTasksStatistics = createSelector(
  selectTasksState,
  (state) => state.statistics
);

// Filtered tasks based on current filter
export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTasksFilter,
  (tasks, filter) => {
    let filteredTasks = [...tasks];

    if (filter.isCompleted !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.isCompleted === filter.isCompleted);
    }

    if (filter.priority !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
    }

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filter.createdAfter) {
      const afterDate = new Date(filter.createdAfter);
      filteredTasks = filteredTasks.filter(task => new Date(task.createdAt) >= afterDate);
    }

    if (filter.createdBefore) {
      const beforeDate = new Date(filter.createdBefore);
      filteredTasks = filteredTasks.filter(task => new Date(task.createdAt) <= beforeDate);
    }

    return filteredTasks;
  }
);

// Completed tasks
export const selectCompletedTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.isCompleted)
);

// Pending tasks
export const selectPendingTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => !task.isCompleted)
);

// Tasks by priority
export const selectTasksByPriority = createSelector(
  selectAllTasks,
  (tasks) => {
    const priorities = [1, 2, 3, 4, 5];
    return priorities.map(priority => ({
      priority,
      tasks: tasks.filter(task => task.priority === priority),
      count: tasks.filter(task => task.priority === priority).length
    }));
  }
);

// Task counts
export const selectTaskCounts = createSelector(
  selectAllTasks,
  (tasks) => ({
    total: tasks.length,
    completed: tasks.filter(task => task.isCompleted).length,
    pending: tasks.filter(task => !task.isCompleted).length,
    highPriority: tasks.filter(task => task.priority >= 4).length
  })
);

// Task stats for dashboard
export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.isCompleted).length,
      pending: tasks.filter(task => !task.isCompleted).length,
      overdue: 0, // We'll implement this when the backend supports due dates
      completedToday: tasks.filter(task => 
        task.isCompleted && 
        task.completedAt && 
        new Date(task.completedAt) >= today
      ).length
    };
  }
);