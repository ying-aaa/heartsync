import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFileData, IFileShowType, UploadedFile } from '@shared/models/common-component';
import { BroadcastService } from '@src/app/core/services/broadcast.service';
import { generateUUID, isMobile } from '@src/app/core/utils';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { FILE_BROADCAST_TOKEN } from '@shared/tokens/app.token';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export function getFileStatus(fileItem: any): string {
  if (fileItem.isCancel) return 'canceled';
  if (fileItem.isError) return 'error';
  if (fileItem.isSuccess) return 'done';
  if (fileItem?.isUploading) return 'uploading';
  if (fileItem.isReady) return 'ready';
  return 'unknown';
}

@Component({
  selector: 'hs-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
  standalone: false,
  providers: [
    {
      provide: FILE_BROADCAST_TOKEN,
      useFactory: () => generateUUID('file-broadcast-'),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HsFileUploadComponent),
      multi: true,
    },
  ],
})
export class HsFileUploadComponent
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('FilePreview') filePreview: ComponentRef<IFileData>;

  private _fileList: any[] = [];

  @Input() set fileList(value: any[]) {
    if (value === this._fileList) return;
    this.writeValue(value);
  }
  get fileList(): any[] {
    return this._fileList;
  }

  @Output() fileListChange = new EventEmitter<IFileData[]>();
  @Output() delItemFile = new EventEmitter<IFileData>();

  // 配置项
  @Input() maxCount = 9;
  @Input() disabled: boolean;
  @Input() fileShowType: IFileShowType = 'grid';
  @Input() uploadUrl: string;
  @Input() formData: any;
  @Input() multiple = true;
  @Input() autoUpload = true;
  @Input() authToken: string = '';
  @Input() allowedFileType: string[] | undefined;
  @Input() maxFileSize: number;
  @Input() fold = false;
  @Input() foldStartIndex = 3;
  @Input() cols = 3;

  isMobileTerminal: boolean = isMobile();
  public uploader: FileUploader;
  subscription: Subscription;

  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(FILE_BROADCAST_TOKEN) private file_broadcast_token: string,
    private broadcastService: BroadcastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.subscription = this.broadcastService.on(this.file_broadcast_token, (name, [fileItem]) => {
      this.deleteItemFile(fileItem);
    });
  }

  private notifyValueChange(): void {
    this.onChange(this._fileList);
    this.fileListChange.emit(this._fileList);
    this.cdr.detectChanges();
  }

  onFilesSelected(event: Event): void {
    this.onTouched();
    // 预览逻辑优化
    if (this._fileList && this._fileList.length > 0) {
      this._fileList.forEach((file) => {
        if (file.url) return; // 已有url跳过
        const reader = new FileReader();
        reader.onload = (e: any) => {
          file.url = e.target.result;
          this.notifyValueChange();
        };
        const fileItem = this.uploader.queue.find((q) => (q as UploadedFile).id === file.id);
        if (fileItem) reader.readAsDataURL(fileItem._file);
      });
    }
  }

  deleteItemFile(fileItem: IFileData) {
    this.onTouched();
    const index = this._fileList.findIndex((file) => file === fileItem || file.id === fileItem.id);
    if (index !== -1) {
      this._fileList.splice(index, 1);

      // 同步删除 Uploader 队列
      const queueItem = this.uploader.queue.find((q) => (q as UploadedFile).id === fileItem.id);
      if (queueItem) {
        this.uploader.cancelItem(queueItem);
        this.uploader.removeFromQueue(queueItem);
      }

      this.notifyValueChange();
      this.delItemFile.emit(fileItem);
    }
  }

  private initializeUploader(): void {
    this.uploader = new FileUploader({
      url: this.uploadUrl,
      isHTML5: true,
      additionalParameter: this.formData,
      authToken: this.authToken || 'Bearer ' + localStorage.getItem('access_token'),
      autoUpload: this.autoUpload,
      allowedFileType: this.allowedFileType,
      removeAfterUpload: true,
    });
    this.setupUploaderEvents();

    this.cdr.detectChanges();
  }

  private setupUploaderEvents(): void {
    this.uploader.onSuccessItem = (fileItem: UploadedFile, response: string) => {
      try {
        const serverResponse = JSON.parse(response);
        fileItem.serverResponse = serverResponse.data;
        this.updateFileList(fileItem);
      } catch (e) {
        console.error('解析上传响应失败', e);
      }
    };

    this.uploader.onAfterAddingFile = (fileItem: UploadedFile) => {
      this.onTouched();
      if (this._fileList.length >= this.maxCount) {
        this.uploader.removeFromQueue(fileItem);
        this._snackBar.open(`最多只能上传 ${this.maxCount} 个文件`, '确定', { duration: 2000 });
        return;
      }

      if (this.maxFileSize && fileItem._file.size > this.maxFileSize * 1024 * 1024) {
        this.uploader.removeFromQueue(fileItem);
        this._snackBar.open(`超出允许的最大上传大小 ${this.maxFileSize}MB`, '确定', {
          duration: 3000,
        });
      } else {
        this.addFileToData(fileItem);
      }
    };

    this.uploader.onErrorItem = (fileItem: UploadedFile) => this.updateFileList(fileItem);
    this.uploader.onProgressItem = (fileItem: UploadedFile) => this.updateFileList(fileItem);
  }

  addFileToData(fileItem: UploadedFile): void {
    const newFileData = {
      id: generateUUID(),
      name: fileItem.file.name,
      status: getFileStatus(fileItem),
      url: '',
      progress: 0,
    };
    fileItem.id = newFileData.id;
    this._fileList.push(newFileData);
    this.notifyValueChange();
  }

  updateFileList(fileItem: UploadedFile) {
    const index = this._fileList.findIndex((file) => file.id === fileItem.id);
    if (index !== -1) {
      this._fileList[index].status = getFileStatus(fileItem);
      this._fileList[index].progress = fileItem.progress;

      if (fileItem.isSuccess) {
        this._fileList[index].url = fileItem.serverResponse?.url || this._fileList[index].url;
        delete this._fileList[index].progress;
      }
      this.notifyValueChange();
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.currentTarget!.classList.add('dragging-over');
  }
  onDragLeave(event: any) {
    event.preventDefault();
    event.currentTarget!.classList.remove('dragging-over');
  }
  onDrop(event: any) {
    this.onTouched();
    event.preventDefault();
    event.currentTarget!.classList.remove('dragging-over');
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.uploader.addToQueue(files);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initializeUploader();
  }

  ngOnDestroy(): void {
    this.uploader?.cancelAll();
    this.subscription?.unsubscribe();
  }

  // ===== ControlValueAccessor 实现 =====
  writeValue(value: any[]): void {
    // 强制转换为新引用，确保内部 UI 刷新
    this._fileList = Array.isArray(value) ? [...value] : [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled && this.uploader) {
      this.uploader.cancelAll();
    }
  }
}
