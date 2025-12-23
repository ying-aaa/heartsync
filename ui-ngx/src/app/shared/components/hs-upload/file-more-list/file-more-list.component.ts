import { input, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isMobile } from '@src/app/core/utils';
import { HsFileDialogComponent } from '../file-dialog/file-dialog.component';

@Component({
  selector: 'hs-file-more-list',
  template: `
    <div class="w-full">
      @if (fileList().length === 1) {
        <hs-file-detail-list
          [fileList]="fileList()"
          [remove]="false"
          [download]="true"
          [preview]="true"
        ></hs-file-detail-list>
      } @else {
        <div class="flex-center py-3px">
          <div class="relative cursor-pointer" (click)="openFilePreviewDialog(fileList())">
            <img width="24px" height="24px" src="/assets/file-type/annex.png" />
            <span class="color-#5182e4"> 多附件 </span>
            <span
              class="absolute w-16px h-16px top-0 bg-#d1e4ff color-#1a79ff rounded-10px -right-22px line-height-16px text-center text-12px"
              style="width: 16px !important"
              >{{ fileList().length }}</span
            >
          </div>
        </div>
      }
    </div>
  `,
  host: { class: 'wh-full' },
  standalone: false,
})
export class HsFileMoreListComponent implements OnInit {
  fileList = input<any[]>([]);
  type = input<'more-detail' | 'more-grid'>('more-detail');

  constructor(private dialog: MatDialog) {}

  openFilePreviewDialog(fileList: any) {
    const width = isMobile() ? '100vw' : '500px';
    const dialogRef = this.dialog.open(HsFileDialogComponent, {
      width,
      minWidth: width,
      data: {
        fileList,
      },
    });
  }

  ngOnInit(): void {}
}
