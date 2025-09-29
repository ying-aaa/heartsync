import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'hs-file-detail-list',
  template: `
    <ng-scrollbar
      class="w-full!"
      #scrollbarRef="ngScrollbar"
      externalViewport
      visibility="hover"
      appearance="compact"
      orientation="auto"
    >
      <div scrollViewport>
        <div class="flex flex-wrap">
          @for (fileItemData of fileData(); track $index) {
            @let isError = fileItemData.status === 'error';
            @let isSuccess = fileItemData.status === 'done';

            <div class="w-full">
              <div class="relative">
                <div class="p-5px qy-file-item">
                  <div
                    class="flex items-center cursor-pointer relative overflow-hidden group"
                  >
                    <img
                      hs-image-preview
                      [src]="fileItemData.url"
                      [previewSrc]="fileItemData.url"
                      class="w-40px h-40px backdrop-fit"
                      [ngClass]="{ 'opacity-50': isError }"
                    />

                    <!-- 文件名称 -->
                    <span
                      class="w-0 flex-1 ml-8px truncate text-14px"
                      [ngClass]="{
                        'color-#5182e4': !isError,
                        'color-red line-through!': isError,
                      }"
                    >
                      {{ fileItemData.name }}
                    </span>

                    <!-- 操作符 -->
                    <div class="z-999 relative">
                      <hs-file-handle
                        [fileItemData]="fileItemData"
                        [download]="download()"
                        [preview]="preview()"
                        [delete]="delete()"
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

              <!-- 分隔线 -->
              @if ($index < fileData().length - 1) {
                <mat-divider class="w-full"></mat-divider>
              }
            </div>
          }
        </div>
      </div>
    </ng-scrollbar>
    <ng-content></ng-content>
  `,
  standalone: false,
})
export class HsFileDetailListComponent implements OnInit {
  fileData = input<any[]>([]);
  foldStartIndex = input<number>(0);

  download = input<boolean>(false);
  preview = input<boolean>(false);
  delete = input<boolean>(true);

  ngOnInit(): void {}
}
