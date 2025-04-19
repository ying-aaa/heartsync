import { ConnectionPositionPair, Overlay } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFileShowType } from '@src/app/shared/models/common-component';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { isMobile } from '@src/app/core/utils';
import { FileItem } from 'ng2-file-upload';

@Component({
  selector: 'hs-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.less'],
  standalone: false,
})
export class FileListComponent implements OnInit {
  @Input() isFile = false;
  @Input() disabled = false;
  @Input() fileShowType: IFileShowType | string = IFileShowType.FORM;
  @Input() fileData: FileItem[] = [];
  @Input() fold = false;
  @Input() foldStartIndex = 3;

  @Output() deleteItemFile = new EventEmitter<FileItem>();

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
    const width = isMobile() ? '100vw' : '500px';
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width,
      minWidth: width,
      data: {
        fileData,
      },
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.fileOverlayWidth = this.isMobileTerminal
      ? 'calc(100vw - 16px)'
      : '306px';
  }
}
