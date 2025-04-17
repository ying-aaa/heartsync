import { ConnectionPositionPair, Overlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFileShowType } from '@src/app/shared/models/common-component';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { isMobile } from '@src/app/core/utils';

@Component({
  selector: 'hs-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.less'],
  standalone: false
})
export class FileListComponent implements OnInit {
  @Input() isFile = false;
  @Input() disabled = false;
  @Input() fileShowType: IFileShowType | string = IFileShowType.FORM;
  @Input() fileData = Array.from({length: 0}, () => ({}));

  elementRef = inject(ElementRef);
  
  IFileShowType = IFileShowType;
  isMobileTerminal: boolean = isMobile();

  isOpen = false;

  fileOverlayWidth = '';

  overlayPositions: ConnectionPositionPair[] = [
    {
      originX: 'center', // 指定触发元素的水平参考点
      originY: 'center', // 指定触发元素的垂直参考点
      overlayX: 'center', // 指定浮层的水平参考点
      overlayY: 'center', // 指定浮层的垂直参考点
      panelClass: this.isMobileTerminal ? 'left-8px!' : '',
    },
  ];

  constructor(
    private overlay: Overlay,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  preview(file: any) {
    // const src = this.autoPrefix(file);
    // if (!this.mayPreview.includes(file.suffix)) return;
    // if (file.suffix === "img") {
    //   this.nzImageService.preview([{
    //     src
    //   }], { nzZoom: 1, nzRotate: 0 });
    // } else {
    //   window.open(src);
    // }
  }

  openFilePreviewDialog(fileData: any) {
    console.log("%c Line:166 🍏 fileData", "color:#ed9ec7", fileData);
    // if (this.isForm) return;
    // const newUrl = entity.map((item: any) => {
    //   const file = {
    //     name: item.name,
    //     url: formatSmdUrl(item.url).prefix(),
    //     previewUrl: formatSmdUrl(item.previewUrl).prefix()
    //   }
    //   return this.suffixHandle(file)
    // })

    // this.modal.create({
    //   nzTitle: '文件查看',
    //   nzContent: this.previewFile,
    //   nzWrapClassName: this.isMobileTerminal && 'fullscreen-modal',
    //   nzComponentParams: {
    //     value: newUrl
    //   },
    //   nzWidth: '40%',
    //   nzFooter: null,
    // });
    const width = isMobile() ? '100vw' : '500px';
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width,
      minWidth: width,
      data: {
        fileData,
      },
    });
  }

  log(val: any) {
    console.log("%c Line:92 🥟 val", "color:#ed9ec7", val);
  }


  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.fileOverlayWidth = this.isMobileTerminal
      ? 'calc(100vw - 16px)'
      :  '283px';
  }
}