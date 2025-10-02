import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { TaskService } from '../../core/services/task.service';
import { TaskStatistics } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <button mat-raised-button color="primary" (click)="goToTasks()">
          <mat-icon>list</mat-icon>
          View Tasks
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.totalTasks || 0 }}</h3>
              <p>Total Tasks</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon completed">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.completedTasks || 0 }}</h3>
              <p>Completed</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon pending">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.pendingTasks || 0 }}</h3>
              <p>Pending</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon rate">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ (stats?.completionRate || 0) | number:'1.0-1' }}%</h3>
              <p>Completion Rate</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .stat-card {
      padding: 0;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 24px;
    }

    .stat-icon {
      margin-right: 16px;
      padding: 12px;
      border-radius: 50%;
      background-color: #e3f2fd;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .stat-icon.completed {
      background-color: #e8f5e8;
    }

    .stat-icon.completed mat-icon {
      color: #4caf50;
    }

    .stat-icon.pending {
      background-color: #fff3e0;
    }

    .stat-icon.pending mat-icon {
      color: #ff9800;
    }

    .stat-icon.rate {
      background-color: #f3e5f5;
    }

    .stat-icon.rate mat-icon {
      color: #9c27b0;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: TaskStatistics | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.taskService.getStatistics().subscribe({
      next: (stats: TaskStatistics) => {
        this.stats = stats;
      },
      error: (error: any) => {
        console.error('Error loading stats:', error);
        // Set default stats if error
        this.stats = {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          completionRate: 0,
          tasksCreatedToday: 0,
          tasksCompletedToday: 0
        };
      }
    });
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}