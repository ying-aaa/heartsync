import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FileSizePipe } from '@src/app/shared/pipes/file-size.pipe';
import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader,
  FileUploadModule,
  FileItem,
} from 'ng2-file-upload';

// const URL = '/api/';
const uploadUrl = 'http://localhost:3000/api/';
interface UploadedFile {
  name: string;
  size: number;
  url: string;
  uploadDate: Date;
}
@Component({
  selector: 'upload-test',
  templateUrl: './upload-test.component.html',
  styleUrls: ['./upload-test.component.less'],
  imports: [FileUploadModule, CommonModule, FileSizePipe],
})
export class UploadTestComponent {
  public uploader: FileUploader;
  public uploadedFiles: UploadedFile[] = [];

  constructor() {
    this.initializeUploader();
  }

  private initializeUploader(): void {
    this.uploader = new FileUploader({
      url: uploadUrl,
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    this.setupUploaderEvents();
  }

  private getAuthToken(): string {
    // 实现你的认证逻辑
    return localStorage.getItem('auth_token') || '';
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

    this.uploader.onErrorItem = (item: FileItem) => {
      console.error(`文件 ${item.file.name} 上传失败`);
      // 可以添加重试逻辑
    };

    this.uploader.onProgressItem = (item: FileItem, progress: number) => {
      console.log(`文件 ${item.file.name} 上传进度: ${progress}%`);
    };
  }

  public getStatus(item: FileItem): string {
    if (item.isSuccess) return '上传成功';
    if (item.isCancel) return '已取消';
    if (item.isError) return '上传失败';
    if (item.isUploading) return '上传中...';
    return '等待上传';
  }
}
