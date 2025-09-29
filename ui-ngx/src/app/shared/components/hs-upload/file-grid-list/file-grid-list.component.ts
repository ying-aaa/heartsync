import { input, Component, computed, OnInit } from '@angular/core';
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
        <div
          class="grid gap-8px"
          [style]="{ gridTemplateColumns: gridTemplateColumns() }"
        >
          @for (fileItemData of fileData(); track $index) {
            @let isError = fileItemData.status === 'error';
            @let isSuccess = fileItemData.status === 'done';

            <div class="wh-full aspect-square">
              <div
                class="relative wh-full cursor-pointer rounded-8px overflow-hidden qy-upload-file-border group"
                [ngClass]="{ 'border-#ff4d4f!': isError }"
              >
                <img
                  [src]="fileItemData.url"
                  class="wh-full backdrop-fit"
                  [ngClass]="{ 'opacity-50': isError }"
                />
                @if (isError) {
                  <mat-icon class="absolute-center color-#ff4d4f"
                    >error_outline
                  </mat-icon>
                }

                <!-- 操作符 -->
                <div
                  class="z-999 rounded-8px absolute wh-full top-0 left-0 hidden group-hover:block bg-#000 bg-opacity-80"
                >
                  <hs-file-handle
                    [fileItemData]="fileItemData"
                    [preview]="true"
                    [download]="false"
                    [delete]="true"
                  ></hs-file-handle>
                </div>

                <!-- 上传过程中文件的进程 -->
                @if (!isError && !isSuccess && fileItemData.status) {
                  <div
                    class="absolute wh-full top-0 left-0 bg-#000 bg-opacity-30"
                  ></div>
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
  fileData = input<any[]>([]);
  // @ts-ignore
  cols = input<number>(3, {
    transform: (value: number) => Math.min(value, 5),
  });

  gridTemplateColumns = computed(
    () => `repeat(${this.cols()}, minmax(0, 1fr))`,
  );

  ngOnInit(): void {}
}
