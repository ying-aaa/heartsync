import { Component, computed, EventEmitter, Input, OnInit } from '@angular/core';
import { IFileData, IFileShowType } from '@src/app/shared/models/common-component';

@Component({
  selector: 'hs-file-detail-list',
  template: ` <ng-scrollbar
    class="w-full!"
    #scrollbarRef="ngScrollbar"
    externalViewport
    visibility="hover"
    appearance="compact"
    orientation="auto"
  >
    <div scrollViewport>
      <div class="flex flex-wrap">
        @for (fileItemData of fileData; track $index) {
          @let isError = fileItemData.status === 'error';
          @let isSuccess = fileItemData.status === 'done';

          <div class="flex flex-row flex-wrap">
            <div class="relative p-3px">
              <div
                class="p-5px qy-upload-file-border"
                [ngClass]="{ 'border-#ff4d4f!': isError }"
              >
                <div
                  class="flex items-center cursor-pointer relative overflow-hidden group"
                >
                  <img
                    hs-image-preview
                    [src]="fileItemData.url"
                    [previewSrc]="fileItemData.url"
                    class="w-80px h-80px"
                    [ngClass]="{ 'opacity-50': isError }"
                  />

                  <!-- 操作符 -->
                  <div
                    class="z-999 absolute wh-full top-0 left-0 hidden group-hover:block qy-file-shade-80"
                  >
                    <hs-file-handle
                      [fileItemData]="fileItemData"
                      [index]="$index"
                      [preview]="true"
                      [download]="!isForm"
                      [delete]="!isList"
                      (deleteItemFile)="deleteItemFile.emit($event)"
                    ></hs-file-handle>
                  </div>

                  <!-- 上传过程中文件的进程 -->
                  @if (!isError && !isSuccess && fileItemData.status) {
                    <div
                      class="absolute wh-full top-0 left-0 qy-file-shade-30"
                    ></div>
                    <style>
                      mat-progress-bar {
                        width: calc(100% - 12px);
                      }
                    </style>
                    <mat-progress-bar
                      class="absolute! left-6px top-10% -translate-y-50% bottom-3px z-999"
                      [mode]="'buffer'"
                      [value]="fileItemData.progress"
                      [bufferValue]="0"
                    ></mat-progress-bar>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </ng-scrollbar>`,
  standalone: false,
})
export class HsFileDetailListComponent implements OnInit {
  @Input() fileData: any[] = [];
  @Input() isFile: boolean = false;
  @Input() fileShowType: IFileShowType = IFileShowType.FORM;

  isList = computed(() => this.fileShowType === IFileShowType.LIST);
  isForm = computed(() => this.fileShowType === IFileShowType.FORM);

  deleteItemFile = new EventEmitter<IFileData>();

  ngOnInit(): void {}
}
