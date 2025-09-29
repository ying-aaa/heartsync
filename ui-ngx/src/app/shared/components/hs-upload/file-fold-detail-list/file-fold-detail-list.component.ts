import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { AfterViewInit, Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { isMobile } from '@src/app/core/utils';

@Component({
  selector: 'hs-file-fold-detail-list',
  template: `
    <hs-file-detail-list [fileData]="fileData().slice(0, 3)">
    </hs-file-detail-list>
    @if (fileData().length > foldStartIndex()) {
      <div
        class="flex-center p-8px cursor-pointer"
        cdkOverlayOrigin
        #trigger="cdkOverlayOrigin"
        (click)="isOpen = !isOpen"
      >
        <div class="relative">
          <span class="color-#5182e4"> ··· </span>
          <span
            class="absolute w-16px h-16px top-0 bg-#d1e4ff color-#1a79ff rounded-10px -right-22px line-height-16px text-center text-12px"
            style="width: 16px !important"
            >{{ fileData().slice(3).length }}</span
          >
        </div>
      </div>

      <!-- 扩展数据 -->
      <ng-template
        cdkConnectedOverlay
        centerHorizontallys
        [cdkConnectedOverlayOrigin]="trigger!"
        [cdkConnectedOverlayOpen]="isOpen"
        [cdkConnectedOverlayPositions]="overlayPositions"
        OverlayKeyboardDispatcher
      >
        <div
          *ngIf="fileData().length > 1"
          class="w-full flex flex-col relative cursor-pointer min-w-250px rounded-8px p-5px shadow-2xl qy-upload-file-border"
          style="background-color: var(--base-bg-color)"
          [style]="{ width: fileOverlayWidth }"
        >
          <div class="flex justify-end">
            <button
              mat-icon-button
              (click)="isOpen = !isOpen"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <mat-divider class="pt-6px"></mat-divider>
          <hs-file-detail-list
            [fileData]="fileData().slice(3)"
            [foldStartIndex]="foldStartIndex()"
          ></hs-file-detail-list>
        </div>
      </ng-template>
    }

    <ng-content></ng-content>
  `,
  standalone: false,
})
export class HsFileFoldDetailListComponent implements OnInit, AfterViewInit {
  fileData = input<any[]>([]);
  foldStartIndex = input<number>(3);

  isOpen = false;
  fileOverlayWidth = '';

  isMobileTerminal: boolean = isMobile();

  overlayPositions: ConnectionPositionPair[] = [
    {
      originX: 'center', // 指定触发元素的水平参考点
      originY: 'center', // 指定触发元素的垂直参考点
      overlayX: 'center', // 指定浮层的水平参考点
      overlayY: 'center', // 指定浮层的垂直参考点
      panelClass: this.isMobileTerminal ? 'left-8px!' : '',
    },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.fileOverlayWidth = this.isMobileTerminal
      ? 'calc(100vw - 16px)'
      : '306px';
  }
}
