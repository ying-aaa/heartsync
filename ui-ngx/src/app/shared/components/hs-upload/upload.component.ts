import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IFileShowType } from '@shared/models/common-component';
import { isMobile } from '@src/app/core/utils';
import { FileItem, FileUploader } from 'ng2-file-upload';

const uploadUrl = 'http://localhost:3000/api/';

interface UploadedFile extends FileItem {
  serverResponse?: {
    name: string;
    size: number;
    url: string;
    uploadDate: Date;
  };
  previewSrc?: any
}

@Component({
  selector: 'hs-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  standalone: false,
})
export class HsUploadFlieComponent implements OnInit, AfterViewInit {
  @ViewChild('FilePreview') filePreview: ComponentRef<any>;
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

  isMobileTerminal: boolean = isMobile();

  public uploader: FileUploader;
  public fileData: UploadedFile[] = [];

  constructor() {
    this.initializeUploader();
  }

  onFilesSelected(event: Event): void {
    if (this.fileData && this.fileData.length > 0) {
      for (let i = 0; i < this.fileData.length; i++) {
        const file = this.fileData[i];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            file.previewSrc = e.target.result as string; // 将 Base64 URL 添加到数组
          }
        };

        reader.readAsDataURL(file._file); // 读取文件内容为 Base64 格式
      }
    }
  }

  deleteItemFile([index, fileData]: any) {
    const fileItemIndex = this.fileData.findIndex(file => file === fileData);
    this.fileData.splice(fileItemIndex, 1);

    const queueIndex = this.uploader.queue.findIndex(file => file === fileData);
    if(queueIndex !== -1) this.uploader.queue.splice(queueIndex, 1);
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
      Reflect.deleteProperty(item, 'progress');
      item.serverResponse = serverResponse;
      // this.fileData.push(item);
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      console.log("%c Line:95 🍿 fileItem", "color:#93c0a4", fileItem);
      if (fileItem._file.size > 100 * 1024 * 1024) {
        this.uploader.removeFromQueue(fileItem); // 从队列中移除文件
      } else {
        // this.fileSizeError = false;
        this.fileData.push(fileItem)
      }
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

  ngAfterViewInit(): void {}

  ngOnInit() {}
}
