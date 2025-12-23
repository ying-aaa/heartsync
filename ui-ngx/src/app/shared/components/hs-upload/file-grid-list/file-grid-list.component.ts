import { input, Component, computed, OnInit } from '@angular/core';
import { isImage, isVideo } from '@src/app/core/utils';
@Component({
  selector: 'hs-file-grid-list',
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
        <div class="grid gap-8px" [style]="{ gridTemplateColumns: gridTemplateColumns() }">
          @for (fileItemData of fileList(); track $index) {
            @let isError = fileItemData.status === 'error';
            @let isSuccess = fileItemData.status === 'done';
            @let isReady = fileItemData.status === 'ready' || fileItemData.status === 'unknown';
            @let url = fileItemData.url;
            <div class="wh-full aspect-square">
              <div
                class="relative wh-full cursor-pointer rounded-8px overflow-hidden qy-upload-file-border group"
                [ngClass]="{ 'border-#ff4d4f!': isError }"
              >
                @if (isImage(url)) {
                  <img
                    [src]="url"
                    class="wh-full backdrop-fit"
                    [ngClass]="{ 'opacity-50': isError }"
                  />
                } @else if (isVideo(url)) {
                  <video class="wh-full bg-#000" [ngClass]="{ 'opacity-50': isError }">
                    <source [src]="url" />
                  </video>
                  <div class="flex-center absolute-center bg-#000/30 rounded-20px">
                    <mat-icon class="color-#fff">play_arrow</mat-icon>
                  </div>
                }
                @if (isError || (!isReady && !isImage(url) && !isVideo(url))) {
                  <mat-icon class="absolute-center color-#ff4d4f">error_outline </mat-icon>
                }

                <!-- 操作符 -->
                <div
                  class="z-999 rounded-8px absolute wh-full top-0 left-0 hidden group-hover:block bg-#000 bg-opacity-80"
                >
                  <hs-file-handle
                    [fileItemData]="fileItemData"
                    [download]="download()"
                    [preview]="preview()"
                    [remove]="remove()"
                  ></hs-file-handle>
                </div>

                <!-- 上传过程中文件的进程 -->
                @if (!isError && !isSuccess && fileItemData.status) {
                  <div class="absolute wh-full top-0 left-0 bg-#000 bg-opacity-30"></div>
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
          }
          <div class="wh-full flex-wrap aspect-square">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </ng-scrollbar>
  `,
  host: { class: 'wh-full' },
  standalone: false,
})
export class HsFileGridListComponent implements OnInit {
  fileList = input<any[]>([]);
  // @ts-ignore
  cols = input<number>(3, {
    transform: (value: number) => Math.min(value, 5),
  });

  download = input<boolean>(false);
  preview = input<boolean>(true);
  remove = input<boolean>(true);

  isVideo = isVideo;
  isImage = isImage;

  gridTemplateColumns = computed(() => `repeat(${this.cols()}, minmax(0, 1fr))`);

  ngOnInit(): void {}
}
