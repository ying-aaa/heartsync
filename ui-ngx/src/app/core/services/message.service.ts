import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, '关闭', {
      duration: 3000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
