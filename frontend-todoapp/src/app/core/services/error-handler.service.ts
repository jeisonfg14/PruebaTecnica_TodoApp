import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  handleError(error: any): void {
    console.error('Global error handler:', error);

    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof Error) {
      this.handleClientError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    let message = 'An error occurred';

    switch (error.status) {
      case 400:
        message = this.extractErrorMessage(error) || 'Invalid request';
        break;
      case 401:
        message = 'Authentication required';
        this.router.navigate(['/auth/login']);
        break;
      case 403:
        message = 'Access denied';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 422:
        message = this.extractValidationErrors(error) || 'Validation failed';
        break;
      case 500:
        message = 'Server error. Please try again later';
        break;
      default:
        message = `Error ${error.status}: ${error.statusText}`;
    }

    this.showError(message);
  }

  private handleClientError(error: Error): void {
    const message = error.message || 'A client error occurred';
    this.showError(message);
  }

  private handleUnknownError(error: any): void {
    const message = 'An unexpected error occurred';
    console.error('Unknown error:', error);
    this.showError(message);
  }

  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (typeof error.error === 'string') {
      return error.error;
    }

    return null;
  }

  private extractValidationErrors(error: HttpErrorResponse): string | null {
    if (error.error?.errors) {
      const errors = Object.values(error.error.errors).flat();
      return errors.join(', ');
    }

    return this.extractErrorMessage(error);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}