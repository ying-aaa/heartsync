import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FileItem } from 'ng2-file-upload';

@Component({
  selector: 'hs-file-handle',
  template: `
    <div class="h-full flex-center">
      @if (preview) {
        <button
          class="w-28px! h-28px! p-1px!"
          mat-icon-button
        >
          <mat-icon class="text-18px! w-18px! h-18px! color-#fff"
            >remove_red_eye</mat-icon
          >
        </button>
        <mat-divider
          [vertical]="true"
          class="h-16px"
        ></mat-divider>
      }
      @if (download) {
        <button
          class="w-28px! h-28px! p-1px!"
          mat-icon-button
        >
          <mat-icon class="text-18px! w-18px! h-18px! color-blue"
            >download</mat-icon
          >
        </button>
        <mat-divider
          [vertical]="true"
          class="h-16px"
        ></mat-divider>
      }

      @if (delete) {
        <button
          class="w-28px! h-28px! p-1px!"
          mat-icon-button
          (click)="deleteItemFileEvent()"
        >
          <mat-icon class="text-18px! w-18px! h-18px! color-#ff0000"
            >delete</mat-icon
          >
        </button>
      }
    </div>
  `,
  standalone: false,
})
export class FileHandleComponent implements OnInit {
  @Input() index: number;
  @Input() preview: boolean = true;
  @Input() download: boolean = true;
  @Input() delete: boolean = true;
  @Input() fileItemData: FileItem;

  @Output() deleteItemFile = new EventEmitter<[number, FileItem]>();

  constructor() {}

  deleteItemFileEvent() {
    this.deleteItemFile.emit([this.index, this.fileItemData]);
  }

  ngOnInit() {}
}
