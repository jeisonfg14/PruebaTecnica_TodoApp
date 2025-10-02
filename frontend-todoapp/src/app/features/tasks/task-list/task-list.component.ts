import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TodoTask, CreateTodoTask } from '../../../core/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  template: `
    <div class="task-container">
      <div class="task-header">
        <h1>Tasks</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="goToDashboard()">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </button>
          <button mat-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </div>

      <!-- Create Task Form -->
      <mat-card class="create-task-card">
        <mat-card-header>
          <mat-card-title>Create New Task</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="taskForm" (ngSubmit)="createTask()" class="task-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Task Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter task title">
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Task description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option [value]="1">Low</mat-option>
                <mat-option [value]="2">Medium</mat-option>
                <mat-option [value]="3">High</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid || creating">
              <mat-icon>add</mat-icon>
              Create Task
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Filter Options -->
      <div class="filter-options">
        <button mat-button 
                (click)="setFilter('all')" 
                [class.active]="currentFilter === 'all'">
          All Tasks
        </button>
        <button mat-button 
                (click)="setFilter('pending')" 
                [class.active]="currentFilter === 'pending'">
          Pending
        </button>
        <button mat-button 
                (click)="setFilter('completed')" 
                [class.active]="currentFilter === 'completed'">
          Completed
        </button>
      </div>

      <!-- Task List -->
      <div class="task-list">
        <mat-card *ngFor="let task of filteredTasks; trackBy: trackByTaskId" class="task-card">
          <mat-card-content class="task-content">
            <div class="task-info">
              <mat-checkbox 
                [checked]="task.isCompleted" 
                (change)="toggleTask(task)">
              </mat-checkbox>
              <div class="task-details" [class.completed]="task.isCompleted">
                <h3>{{ task.title }}</h3>
                <p *ngIf="task.description">{{ task.description }}</p>
                <div class="task-meta">
                  <span class="priority" [class]="'priority-' + task.priority">
                    Priority: {{ getPriorityText(task.priority) }}
                  </span>
                  <span class="date">{{ task.createdAt | date:'short' }}</span>
                </div>
              </div>
            </div>
            <div class="task-actions">
              <button mat-icon-button color="warn" (click)="deleteTask(task)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <div *ngIf="filteredTasks.length === 0" class="no-tasks">
          <mat-icon>assignment</mat-icon>
          <p>No tasks found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .task-header h1 {
      margin: 0;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .create-task-card {
      margin-bottom: 24px;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .task-form .full-width {
      width: 100%;
    }

    .filter-options {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .filter-options button.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .task-card {
      transition: box-shadow 0.2s;
    }

    .task-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .task-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
    }

    .task-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }

    .task-details h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #333;
    }

    .task-details.completed h3 {
      text-decoration: line-through;
      color: #666;
    }

    .task-details p {
      margin: 0 0 8px 0;
      color: #666;
    }

    .task-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #999;
    }

    .priority {
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }

    .priority-1 {
      background-color: #e8f5e8;
      color: #4caf50;
    }

    .priority-2 {
      background-color: #fff3e0;
      color: #ff9800;
    }

    .priority-3 {
      background-color: #ffebee;
      color: #f44336;
    }

    .no-tasks {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .no-tasks mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .task-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .filter-options {
        flex-wrap: wrap;
      }

      .task-content {
        flex-direction: column;
        gap: 16px;
      }

      .task-actions {
        align-self: flex-end;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: TodoTask[] = [];
  filteredTasks: TodoTask[] = [];
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  creating = false;

  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      priority: [2, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks: TodoTask[]) => {
        this.tasks = tasks;
        this.applyFilter();
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  createTask(): void {
    if (this.taskForm.valid) {
      this.creating = true;
      const newTask: CreateTodoTask = this.taskForm.value;

      this.taskService.createTask(newTask).subscribe({
        next: (task: TodoTask) => {
          this.tasks.unshift(task);
          this.applyFilter();
          this.taskForm.reset();
          this.taskForm.patchValue({ priority: 2 });
          this.creating = false;
          this.notificationService.success('Task created successfully!');
        },
        error: (error: any) => {
          console.error('Error creating task:', error);
          this.creating = false;
          this.notificationService.error('Failed to create task. Please try again.');
        }
      });
    }
  }

  toggleTask(task: TodoTask): void {
    this.taskService.updateTask(task.id, { isCompleted: !task.isCompleted }).subscribe({
      next: (updatedTask: TodoTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.applyFilter();
          const status = updatedTask.isCompleted ? 'completed' : 'pending';
          this.notificationService.success(`Task marked as ${status}`);
        }
      },
      error: (error: any) => {
        console.error('Error updating task:', error);
        this.notificationService.error('Failed to update task. Please try again.');
      }
    });
  }

  deleteTask(task: TodoTask): void {
    this.notificationService.confirm(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      'Delete',
      'Cancel'
    ).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
            this.applyFilter();
            this.notificationService.success('Task deleted successfully');
          },
          error: (error: any) => {
            console.error('Error deleting task:', error);
            this.notificationService.error('Failed to delete task. Please try again.');
          }
        });
      }
    });
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    switch (this.currentFilter) {
      case 'pending':
        this.filteredTasks = this.tasks.filter(task => !task.isCompleted);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.isCompleted);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  trackByTaskId(index: number, task: TodoTask): number {
    return task.id;
  }

  getPriorityText(priority: number): string {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Medium';
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}