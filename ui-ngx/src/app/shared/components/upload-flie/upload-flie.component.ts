import {
  ConnectionPositionPair,
  Overlay,
  OverlayModule,
  OverlayPositionBuilder,
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isMobile } from '@src/app/core/utils';
import { IFileShowType } from '@shared/models/common-component';
import { MatDividerModule } from '@angular/material/divider';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { FileHandleComponent } from './file-handle/file-handle.component';

@Component({
  selector: 'hs-upload-flie',
  templateUrl: './upload-flie.component.html',
  styleUrls: ['./upload-flie.component.less'],
  imports: [
    FileHandleComponent,
    CommonModule,
    MatIconModule,
    OverlayModule,
    MatDividerModule,
    PortalModule,
    MatButtonModule,
    NgScrollbarModule,
    MatDialogModule,
    MatListModule
  ],
})
export class HsUploadFlieComponent implements OnInit, AfterViewInit {
  @ViewChild('FilePreview') filePreview: any;
  // 源数据
  @Input() rdata: any;
  // key
  @Input() column: any;
  // 是否是详情页
  @Input() isDetail: boolean;
  // 表单还是列表
  @Input() isForm: boolean;
  // 文件还是图片
  @Input() isFile: boolean = true;
  // 是否禁用
  @Input() isDisabled: boolean;
  // 上传文件时的文件上传进度信息
  @Input() fileUploadInfo: any;

  @Input() fileShowType: IFileShowType | string = IFileShowType.FORM;

  @Output() change = new EventEmitter<any>();

  elementRef = inject(ElementRef);

  IFileShowType = IFileShowType;

  inUploadInfo = {};
  fileData = Array.from({length: 9}, () => ({}));
  mayPreview = ['img', 'docx', 'doc', 'pdf'];
  isMobileTerminal: boolean = isMobile();
  isOpen = false;
  // trigger: any;

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

  positionStrategy = this.overlay.position().global().left('0').top('0'); // 设置浮层左上角对齐屏幕左上角

  constructor(
    private overlay: Overlay,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  deletFile(fileData: any, index: number) {
    this.change.emit({
      file: { ...fileData, status: 'removed', index },
      fileList: [],
      type: 'indexRemoved',
    }); // 发送数据到父组件
  }

  onlineView(file: any, type: 'download' | 'view'): any {
    if (type === 'view') {
      let url = file.previewUrl || file.url;
      if (!url)
        return this._snackBar.open(
          '文件预览地址丢失，无法查看，请尝试下载！',
          '确定',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          },
        );
      // let previewUrl = url.startsWith("/gapi/smdx/storage_area/public") ? url : `/gapi/smdx/storage_area/public${url}`;
      let previewUrl = this.autoPrefix({ url });
      window.open(previewUrl);
      return;
    }
    if (!file.url)
      return this._snackBar.open('文件下载地址丢失，无法下载！', '确定', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3 * 1000,
      });
    let downLoadUrl = file.url;
    // downLoadUrl = downLoadUrl.startsWith("/gapi/smdx/storage_area/public") ? downLoadUrl : `/gapi/smdx/storage_area/public${downLoadUrl}`;
    downLoadUrl = this.autoPrefix({ url: downLoadUrl });
    // if (file.suffix === "unknown") {
    // } else
    if (file.suffix === 'img') {
      this.fileDownload(downLoadUrl, file.name);
    } else {
      fetch(downLoadUrl)
        .then((response) => response.blob())
        .then((blob) => {
          var url = URL.createObjectURL(blob);
          this.fileDownload(url, file.name);
          URL.revokeObjectURL(url);
        })
        .catch((e) => console.error(e));
    }
  }

  preview(file: any) {
    const src = this.autoPrefix(file);
    if (!this.mayPreview.includes(file.suffix)) return;
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

  fileDownload(url: string, fileName: string) {
    var link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  suffixHandle(file: any) {
    if (!file.name) return { ...file, suffix: 'img' };
    let lastDotIndex = file.name.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return file;
    }
    let suffix = file.name.substring(lastDotIndex + 1);
    const img = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const rest = ['docx', 'doc', 'pdf', 'xls', 'xlsx'];
    if ([...img, ...rest].includes(suffix)) {
      suffix = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(suffix)
        ? 'img'
        : suffix;
      if (suffix === 'doc') suffix = 'docx';
      if (suffix === 'xls') suffix = 'xlsx';
    } else {
      suffix = 'unknown';
    }
    return { ...file, suffix };
  }

  filterImg(data: any) {
    return data.filter((item: any) => item.suffix == 'img').slice(0, 3);
  }

  autoPrefix(file: any) {
    let url = file.url;
    if (!url) return url;
    return url;
  }

  findUpload(fileData: any) {
    // if (!this.fileUploadInfo) return;
    // if (this.inUploadInfo[fileData.uid] && this.inUploadInfo[fileData.uid].type === "progress") return true;
    // return false
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.fileOverlayWidth = this.isMobileTerminal
      ? 'calc(100vw - 16px)'
      : this.elementRef.nativeElement.offsetWidth + 'px';
  }

  ngOnChanges(changes: { [column: string]: SimpleChange }) {
    if (changes['rdata']) {
      let objData;
      if (this.isDetail) {
        objData = this.rdata || [];
      } else {
        // objData = jsonToObj(this.rdata[this.column.td], []);
      }
      this.fileData = objData.map(this.suffixHandle);
      this.cdr.detectChanges();
    }
    // if (changes['fileUploadInfo']) {
    //   if (!this.fileUploadInfo) return;
    //   if (this.fileUploadInfo.type !== "progress" && this.inUploadInfo[this.fileUploadInfo.file?.uid]) {
    //     delete this.inUploadInfo[this.fileUploadInfo.file?.uid]
    //   }
    //   this.inUploadInfo[this.fileUploadInfo.file?.uid] = this.fileUploadInfo;
    // }
  }
}
