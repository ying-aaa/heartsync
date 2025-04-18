import {
  AfterViewInit,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFileShowType } from '@shared/models/common-component';
import { isMobile } from '@src/app/core/utils';
import { FileItem, FileUploader } from 'ng2-file-upload';

const uploadUrl = 'http://192.168.31.129:3000/api/';

interface IOriginFileItem {
  id?: number;
  name: string;
  previewUrl: string;
}

interface UploadedFile extends FileItem {
  serverResponse?: {
    name: string;
    size: number;
    url: string;
    uploadDate: Date;
  };
  originFileItem?: IOriginFileItem;
  previewUrl?: any;
}

@Component({
  selector: 'hs-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  standalone: false,
})
export class HsUploadFlieComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild('FilePreview') filePreview: ComponentRef<any>;

  @Input() filesData: IOriginFileItem[] = [];
  @Output() filesDataChange = new EventEmitter<IOriginFileItem[]>();

  // 文件还是图片
  @Input() isFile = false;
  // 禁用
  @Input() disabled: boolean;
  // 上传文件时的文件上传进度信息
  @Input() fileShowType: IFileShowType | string = IFileShowType.FORM;
  // url
  @Input() uploadUrl = uploadUrl;
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

  isMobileTerminal: boolean = isMobile();

  public uploader: FileUploader;
  public fileData: UploadedFile[] = [];

  constructor(private _snackBar: MatSnackBar) {
    this.initializeUploader();
  }

  onFilesSelected(event: Event): void {
    if (this.fileData && this.fileData.length > 0) {
      for (let i = 0; i < this.fileData.length; i++) {
        const file = this.fileData[i];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            file.previewUrl = e.target.result as string; // 将 Base64 URL 添加到数组
            this.updateFilesData();
          }
        };

        reader.readAsDataURL(file._file); // 读取文件内容为 Base64 格式
      }
    }
  }

  deleteItemFile(fileItem: FileItem) {
    const fileItemIndex = this.fileData.findIndex((file) => file === fileItem);
    this.fileData.splice(fileItemIndex, 1);

    this.uploader.cancelItem(fileItem);
    this.uploader.removeFromQueue(fileItem);

    this.updateFilesData();
  }

  private initializeUploader(): void {
    this.uploader = new FileUploader({
      url: this.uploadUrl,
      isHTML5: true,
      authToken: this.authToken,
      autoUpload: this.autoUpload, // 是否自动上传
      allowedFileType: this.allowedFileType, // 允许的文件类型
      removeAfterUpload: true,

      // maxFileSize: 5 * 1024 * 1024, // 10MB
    });

    this.setupUploaderEvents();
  }

  private setupUploaderEvents(): void {
    this.uploader.onSuccessItem = (item: UploadedFile, response: string) => {
      const serverResponse = JSON.parse(response);
      item.serverResponse = serverResponse;
      // this.fileData.push(item);
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      if (
        this.maxFileSize &&
        fileItem._file.size > this.maxFileSize * 1024 * 1024
      ) {
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
        // this.fileSizeError = false;
        this.fileData.push(fileItem);
      }

      this.updateFilesData();
    };

    this.uploader.onErrorItem = (item: FileItem) => {
      console.error(`文件 ${item.file.name} 上传失败`);
      // this.fileData.push(item);

      // 可以添加重试逻辑
    };

    this.uploader.onProgressItem = (item: FileItem, progress: number) => {
      console.log(`文件 ${item.file.name} 上传进度: ${progress}%`);
    };
  }

  updateFilesData() {
    this.fileData.forEach((fileItem) => {
      if (!fileItem.originFileItem) {
        fileItem.originFileItem = {
          name: fileItem._file.name,
          previewUrl: fileItem.previewUrl,
        };
      } else {
        fileItem.originFileItem.previewUrl = fileItem.previewUrl;
      }
    });
    const newFilesData = this.fileData.map(
      ({ originFileItem }) => originFileItem!,
    );
    this.filesDataChange.emit(newFilesData);
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

  syncFilesData(
    newFilesData: { id: string; name: string; url: string }[],
  ): void {
    // 清空当前的上传队列
    this.uploader.queue = [];

    // 将新的文件数据转换为 FileItem 并添加到队列
    newFilesData.forEach((fileData) => {
      // @ts-ignore
      const fileItem = new FileItem(
        this.uploader,
        // @ts-ignore
        fileData,
        {},
      );
      // fileItem.file.id = fileData.id; // 为 FileItem 添加自定义属性
      // this.uploader.queue.push(fileItem);
      const file = this.fileData.find(
        (item) => (item.originFileItem as any) === fileData,
      );
      if (!file) {
        (fileItem as any).originFileItem = fileData;
        this.fileData.push(fileItem);
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // 销毁 Uploader 实例
    if (this.uploader) {
      this.uploader.cancelAll(); // 取消所有未完成的上传任务
      // this.uploader = null;
      // this.uploader.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filesData'] && changes['filesData'].currentValue) {
      // 当 filesData 发生变化时，重新同步数据
      // this.syncFilesData(changes['filesData'].currentValue);
    }
  }
}
