import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FILE_BROADCAST_TOKEN } from '@shared/tokens/app.token';
import { generateUUID } from '@src/app/core/utils';

@Component({
  selector: 'hs-file-dialog',
  template: `
    <div class="flex items-center justify-center flex-col viewFile">
      <div mat-dialog-title class="relative w-full flex justify-between">
        <span>文件查看</span>
        <button mat-icon-button mat-dialog-close class="absolute! right-12px">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-divider class="w-full"></mat-divider>
      <!-- @let scrollHeight = fileList.length > 12 ? '582px' : 'auto'; -->
      <div class="w-full p-20px">
        <!-- <hs-file-detail-list
          [fileList]="fileList"
          [preview]="true"
          [download]="true"
          [delete]="false"
        ></hs-file-detail-list> -->
        <hs-file-grid-list
          [fileList]="fileList"
          [cols]="5"
          [preview]="true"
          [download]="true"
          [remove]="false"
        ></hs-file-grid-list>
      </div>

      <!-- <ng-scrollbar
        class="w-full!"
        [style]="{ height: scrollHeight }"
        #scrollbarRef="ngScrollbar"
        externalViewport
        visibility="hover"
        appearance="compact"
        orientation="auto"
      >
        <ul scrollViewport class="w-full px-20px py-3px">
          @for (fileItemData of fileList; track $index) {
            <li class="h-56px">
              <div class="wh-full flex-center">
                <img [src]="fileItemData.url" width="32px" height="32px" />
                <div
                  class="line-height-24px w-0 flex-1 mx-8px truncate text-14px color-#5182e4 cursor-pointer"
                >
                  {{ fileItemData.name }}
                </div>
                <hs-file-handle
                  [fileItemData]="fileItemData"
                  [delete]="false"
                ></hs-file-handle>
              </div>
              @if ($index < fileList.length - 1) {
                <mat-divider class="w-full h-1px"></mat-divider>
              }
            </li>
          }
        </ul>
      </ng-scrollbar> -->
    </div>
  `,
  standalone: false,
  providers: [
    // 使用 hs-file-handle 则需要注入
    {
      provide: FILE_BROADCAST_TOKEN,
      useFactory: () => generateUUID('file-broadcast-'),
    },
  ],
})
export class HsFileDialogComponent implements OnInit, OnChanges {
  @Input() fileList: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.fileList) {
      this.fileList = this.dialogData.fileList;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileList']) {
      this.fileList = changes['fileList'].currentValue;
    }
  }
}
