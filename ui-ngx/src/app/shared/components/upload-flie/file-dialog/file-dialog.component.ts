import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FileHandleComponent } from '../file-handle/file-handle.component';

@Component({
  selector: 'hs-file-dialog',
  template: `
    <div class="flex items-center justify-center flex-col viewFile">
      <div mat-dialog-title class="relative w-full flex justify-between">
        <span>文件查看</span>
        <button
          mat-icon-button
          mat-dialog-close
          class="absolute! right-12px"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-divider class="w-full"></mat-divider>
      @let scrollHeight = fileData.length > 12 ? '582px' : 'auto';
      <ng-scrollbar
        class="w-full!"
        [style]="{ height: scrollHeight }"
        #scrollbarRef="ngScrollbar"
        externalViewport
        visibility="hover"
        appearance="compact"
        orientation="auto"
      >
        <ul scrollViewport class="w-full px-20px py-3px">
          @for (item of fileData; track $index) {
            <li 
              class="h-56px"
            >
              <div  class="wh-full flex-center">
                <img
                  width="21px"
                  height="21px"
                  src="/assets/file-type/annex.png"
                />
                <div class="line-height-24px w-0 flex-1 mx-8px truncate text-14px color-#5182e4 cursor-pointer">我是文件的名称xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                <hs-file-handle 
                  [fileItemData]="item" 
                  [index]="$index" 
                  [preview]="false"
                  [delete]="false"
                ></hs-file-handle>
              </div>
              @if($index < fileData.length - 1) {
                <mat-divider
                  class="w-full h-1px"
                ></mat-divider>
              }
            </li>
          }
        </ul>
      </ng-scrollbar>
    </div>
  `,
  imports: [
    FileHandleComponent,
    NgScrollbarModule,
    MatButtonModule, 
    MatDialogModule,
    MatIconModule, 
    MatDivider,
  ]
})
export class FileDialogComponent implements OnInit, OnChanges {
  @Input() fileData: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any 
  ) {}

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.fileData) {
      this.fileData = this.dialogData.fileData;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileData']) {
      this.fileData = changes['fileData'].currentValue;
    }
  }
}
