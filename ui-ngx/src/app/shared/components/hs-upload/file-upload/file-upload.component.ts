import { Component, Input, OnInit } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';

const uploadUrl = 'http://localhost:3000/api/';

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  uploadDate: Date;
}

@Component({
  selector: 'hs-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: false
})
export class FileUploadComponent implements OnInit {
  @Input() uploadUrl = uploadUrl;
  @Input() multiple = true;
  @Input() autoUpload = true;
  @Input() authToken: string;
  @Input() allowedFileType: string[];
  
  public uploader: FileUploader;
  public uploadedFiles: UploadedFile[] = [];

  constructor() {
    this.initializeUploader();
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
    this.uploader.onSuccessItem = (item: FileItem, response: string) => {
      const serverResponse = JSON.parse(response);
      this.uploadedFiles.push({
        name: item.file.name as any,
        size: item.file.size,
        url: serverResponse.downloadUrl, // 假设服务器返回下载URL
        uploadDate: new Date(),
      });
    };

    
    this.uploader.onAfterAddingFile = (fileItem) => {
      if (fileItem._file.size > 5 * 1024 * 1024) {
        this.uploader.removeFromQueue(fileItem); // 从队列中移除文件
      } else {
        // this.fileSizeError = false;
      }
    };


    this.uploader.onErrorItem = (item: FileItem) => {
      console.error(`文件 ${item.file.name} 上传失败`);
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

  ngOnInit() {
  }

}
