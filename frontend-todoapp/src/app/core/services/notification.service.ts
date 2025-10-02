import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Success notification
  success(message: string, duration: number = 4000): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    };
    this.snackBar.open(message, 'Close', config);
  }

  // Error notification
  error(message: string, duration: number = 6000): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    };
    this.snackBar.open(message, 'Close', config);
  }

  // Warning notification
  warning(message: string, duration: number = 5000): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    };
    this.snackBar.open(message, 'Close', config);
  }

  // Info notification
  info(message: string, duration: number = 4000): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    };
    this.snackBar.open(message, 'Close', config);
  }

  // Confirmation dialog
  confirm(
    title: string,
    message: string,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        confirmText,
        cancelText
      },
      autoFocus: false,
      restoreFocus: false
    });

    return dialogRef.afterClosed();
  }
}