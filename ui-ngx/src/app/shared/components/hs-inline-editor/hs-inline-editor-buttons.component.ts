import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'hs-inline-editor-buttons',
  template: `
    <div class="hs-inline-editor-buttons shadow flex gap-4px bg-[var(--base-bg-color)] text-[var(--primary-text-color)]">
      <button
        mat-icon-button
        (click)="onConfirm()"
        class="hs-icon-button-32"
      >
        <mat-icon class="material-icons-round"> check </mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="onCancel()"
        class="hs-icon-button-32"
      >
        <mat-icon class="material-icons-round"> close </mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .hs-inline-editor-buttons {
      display: flex;
      gap: 4px;
    }
  `],
  standalone: true,
  imports: [MatIconModule, MatButtonModule]
})
export class HsInlineEditorButtonsComponent {
  // 注入父组件的回调函数
  constructor(
    @Inject('confirmEdit') private confirmEdit: () => void,
    @Inject('cancelEdit') private cancelEdit: () => void
  ) {}

  onConfirm(): void {
    this.confirmEdit();
  }

  onCancel(): void {
    this.cancelEdit();
  }
}