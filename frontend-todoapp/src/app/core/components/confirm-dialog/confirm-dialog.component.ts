import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button 
                [mat-dialog-close]="false"
                class="cancel-button">
          {{ data.cancelText }}
        </button>
        <button mat-raised-button 
                color="warn"
                [mat-dialog-close]="true"
                class="confirm-button">
          {{ data.confirmText }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 0;
      min-width: 350px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .warning-icon {
      color: #ff9800;
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .dialog-content {
      padding: 20px 24px;
      margin: 0;
    }

    .dialog-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .dialog-actions {
      padding: 16px 24px 20px;
      margin: 0;
      gap: 12px;
      justify-content: flex-end;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-button {
      color: #666;
      border-color: #ddd;
    }

    .cancel-button:hover {
      background-color: #f5f5f5;
    }

    .confirm-button {
      background-color: #f44336;
      color: white;
    }

    .confirm-button:hover {
      background-color: #d32f2f;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}