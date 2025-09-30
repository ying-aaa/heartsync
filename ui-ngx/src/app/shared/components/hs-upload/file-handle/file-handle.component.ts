import { Component, Inject, Input, OnInit } from '@angular/core';
import { BroadcastService } from '@src/app/core/services/broadcast.service';
import { download } from '@src/app/core/utils';
import { IFileData } from '@src/app/shared/models/common-component';
import { FILE_BROADCAST_TOKEN } from '@src/app/shared/tokens/app.token';

@Component({
  selector: 'hs-file-handle',
  template: `
    <div class="h-full flex-center">
      @if (preview) {
        <button
          class="w-28px! h-28px! p-1px!"
          mat-icon-button
          hs-image-preview
          [previewSrc]="fileItemData.url"
        >
          <mat-icon class="text-18px! w-18px! h-18px! color-#999"
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
          (click)="downloadItemFile()"
        >
          <mat-icon class="text-18px! w-18px! h-18px! color-blue"
            >download</mat-icon
          >
        </button>
        @if (remove) {
          <mat-divider
            [vertical]="true"
            class="h-16px"
          ></mat-divider>
        }
      }

      @if (remove) {
        <button
          mat-icon-button
          color="#fff"
          class="w-28px! h-28px! p-1px!"
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
export class HsFileHandleComponent implements OnInit {
  @Input() preview: boolean = true;
  @Input() download: boolean = true;
  @Input() remove: boolean = true;
  @Input() fileItemData: IFileData;

  constructor(
    @Inject(FILE_BROADCAST_TOKEN) private file_broadcast_token: string,
    private broadcastService: BroadcastService,
  ) {}

  downloadItemFile() {
    const { url, name } = this.fileItemData;
    download(url, name);
  }

  deleteItemFileEvent() {
    this.broadcastService.broadcast(
      this.file_broadcast_token,
      this.fileItemData,
    );
  }

  ngOnInit() {}
}
