import {
  AfterViewInit,
  Component,
  ComponentRef,
  EventEmitter,
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

export function getFileStatus(fileItem: any): string {
  if (fileItem.isCancel) {
    return 'canceled'; // 文件被取消上传
  } else if (fileItem.isError) {
    return 'error'; // 文件上传失败
  } else if (fileItem.isSuccess) {
    return 'done'; // 文件上传成功
  } else if (fileItem?.isUploading) {
    return 'uploading'; // 文件正在上传
  } else if (fileItem.isReady) {
    return 'ready'; // 文件准备好，等待上传
  } else {
    return 'unknown'; // 未知状态
  }
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
  ],
})
export class HsFlieUploadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('FilePreview') filePreview: ComponentRef<IFileData>;

  @Input() fileData: any[] = [];
  @Output() fileDataChange = new EventEmitter<IFileData[]>();

  @Output() delItemFile = new EventEmitter<IFileData>();

  // 最大上传数量
  @Input() maxCount = 9;
  // 禁用
  @Input() disabled: boolean;
  // 上传文件时的文件上传进度信息
  @Input() fileShowType: IFileShowType = 'grid';
  // url
  @Input() uploadUrl: string;
  // formData
  @Input() formData: any;
  // 多选
  @Input() multiple = true;
  // 自动上传
  @Input() autoUpload = true;
  // 身份token
  @Input() authToken: string;
  // 允许上传的文件类型
  @Input() allowedFileType: string[];
  // 最大上传大小
  @Input() maxFileSize: number;
  // 开启折叠
  @Input() fold = false;
  // 第几个开始折叠
  @Input() foldStartIndex = 3;
  // 列数，type 为 "grid" 时有效
  @Input() cols = 3;

  isMobileTerminal: boolean = isMobile();

  public uploader: FileUploader;

  subscription: Subscription;

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(FILE_BROADCAST_TOKEN) private file_broadcast_token: string,
    private broadcastService: BroadcastService,
  ) {
    this.subscription = this.broadcastService.on(this.file_broadcast_token, (name, [fileItem]) => {
      this.deleteItemFile(fileItem);
    });
  }

  onFilesSelected(event: Event): void {
    if (this.fileData && this.fileData.length > 0) {
      for (let i = 0; i < this.fileData.length; i++) {
        const file = this.fileData[i];
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            file.url = e.target.result as string; // 将 Base64 URL 添加到数组
          }
        };
        const fileItem = this.uploader.queue.find(
          (queueItem) => (queueItem as UploadedFile).id === file.id,
        );
        if (fileItem)
          // 读取文件内容为 Base64 格式
          reader.readAsDataURL(fileItem._file);
      }
    }
  }

  deleteItemFile(fileItem: IFileData) {
    // 删除fileData的
    const fileItemIndex = this.fileData.findIndex((file) => file === fileItem);
    this.fileData.splice(fileItemIndex, 1);
    // 删除队列的
    const queueItem = this.uploader.queue.find(
      (queueItem) => (queueItem as UploadedFile).id === fileItem.id,
    );
    try {
      if (queueItem) {
        this.uploader.cancelItem(queueItem);
        this.uploader.removeFromQueue(queueItem);
      }
    } catch (error) {
      console.log('删除文件报错 error ->', error);
    }

    this.delItemFile.emit(fileItem);
  }

  private initializeUploader(): void {
    this.uploader = new FileUploader({
      url: this.uploadUrl,
      isHTML5: true,
      additionalParameter: this.formData,
      authToken: this.authToken,
      autoUpload: this.autoUpload, // 是否自动上传
      allowedFileType: this.allowedFileType, // 允许的文件类型
      removeAfterUpload: true,

      // maxFileSize: 5 * 1024 * 1024, // 10MB
    });

    this.setupUploaderEvents();
  }

  private setupUploaderEvents(): void {
    this.uploader.onSuccessItem = (fileItem: UploadedFile, response: string) => {
      const serverResponse = JSON.parse(response);
      fileItem.serverResponse = serverResponse.data;
      this.updateFileData(fileItem);
    };

    this.uploader.onAfterAddingFile = (fileItem: UploadedFile) => {
      if (this.maxFileSize && fileItem._file.size > this.maxFileSize * 1024 * 1024) {
        this.uploader.removeFromQueue(fileItem); // 从队列中移除文件
        this._snackBar.open(
          // ${fileItem._file.name}：
          `超出允许的最大上传大小 ${this.maxFileSize}MB`,
          '确定',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          },
        );
      } else {
        this.addFileToData(fileItem);
      }
    };

    this.uploader.onErrorItem = (fileItem: UploadedFile) => {
      this.updateFileData(fileItem);
    };

    this.uploader.onProgressItem = (fileItem: UploadedFile) => {
      this.updateFileData(fileItem);
    };
  }

  addFileToData(fileItem: UploadedFile): void {
    const newFileData = {
      id: generateUUID(),
      name: fileItem.file.name,
      status: getFileStatus(fileItem),
      url: '',
    };
    fileItem.id = newFileData.id; // 注意，这样直接扩展 file 对象的属性在实际开发中需要谨慎使用
    this.fileData.push(newFileData);
    this.fileDataChange.emit(this.fileData);
  }

  updateFileData(fileItem: UploadedFile) {
    const index = this.fileData.findIndex((file) => file.id === fileItem.id);
    if (index !== -1) {
      // this.fileData[index].url = fileItem.serverResponse?.url;
      this.fileData[index].status = getFileStatus(fileItem);
      this.fileData[index].progress = fileItem.progress;
      if (fileItem.isSuccess) {
        this.fileData[index].url = fileItem.serverResponse?.url;
        Reflect.deleteProperty(this.fileData[index], 'progress');
      }
      this.fileDataChange.emit(this.fileData);
    }
  }

  // 拖拽文件到按钮
  onDragOver(event: any) {
    event.preventDefault(); // 阻止默认行为，允许文件拖拽
    event.currentTarget!.classList.add('dragging-over');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.currentTarget!.classList.remove('dragging-over');
  }

  onDrop(event: any) {
    event.preventDefault();
    event.currentTarget!.classList.remove('dragging-over');

    // 获取拖拽的文件
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploader.addToQueue(files);
    }
  }

  ngOnInit() {
    this.initializeUploader();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // 销毁 Uploader 实例
    this.uploader?.cancelAll(); // 取消所有未完成的上传任务
    this.subscription?.unsubscribe();
  }
}
