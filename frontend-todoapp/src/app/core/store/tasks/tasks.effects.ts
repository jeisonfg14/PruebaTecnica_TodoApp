import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { TodoTask, TaskStatistics } from '../../models';
import * as TasksActions from './tasks.actions';

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(action =>
        this.taskService.getTasks(action.filter).pipe(
          map((tasks: TodoTask[]) => TasksActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TasksActions.loadTasksFailure({ error: error.message || 'Failed to load tasks' })))
        )
      )
    )
  );

  loadTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTask),
      switchMap(action =>
        this.taskService.getTask(action.id).pipe(
          map((task: TodoTask) => TasksActions.loadTaskSuccess({ task })),
          catchError(error => of(TasksActions.loadTaskFailure({ error: error.message || 'Failed to load task' })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      exhaustMap(action =>
        this.taskService.createTask(action.task).pipe(
          map((task: TodoTask) => TasksActions.createTaskSuccess({ task })),
          catchError(error => of(TasksActions.createTaskFailure({ error: error.message || 'Failed to create task' })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      exhaustMap(action =>
        this.taskService.updateTask(action.id, action.updates).pipe(
          map((task: TodoTask) => TasksActions.updateTaskSuccess({ task })),
          catchError(error => of(TasksActions.updateTaskFailure({ error: error.message || 'Failed to update task' })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      exhaustMap(action =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TasksActions.deleteTaskSuccess({ id: action.id })),
          catchError(error => of(TasksActions.deleteTaskFailure({ error: error.message || 'Failed to delete task' })))
        )
      )
    )
  );

  toggleTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.toggleTask),
      exhaustMap(action =>
        this.taskService.toggleTask(action.id).pipe(
          switchMap(() => 
            // Reload the specific task to get updated data
            this.taskService.getTask(action.id).pipe(
              map((task: TodoTask) => TasksActions.toggleTaskSuccess({ task }))
            )
          ),
          catchError(error => of(TasksActions.toggleTaskFailure({ error: error.message || 'Failed to toggle task' })))
        )
      )
    )
  );

  loadStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadStatistics),
      switchMap(() =>
        this.taskService.getStatistics().pipe(
          map((statistics: TaskStatistics) => TasksActions.loadStatisticsSuccess({ statistics })),
          catchError(error => of(TasksActions.loadStatisticsFailure({ error: error.message || 'Failed to load statistics' })))
        )
      )
    )
  );

  // Reload tasks after successful create, update, delete, or toggle
  reloadTasksAfterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TasksActions.createTaskSuccess,
        TasksActions.updateTaskSuccess,
        TasksActions.deleteTaskSuccess,
        TasksActions.toggleTaskSuccess
      ),
      map(() => TasksActions.loadStatistics()) // Reload statistics when tasks change
    )
  );
}