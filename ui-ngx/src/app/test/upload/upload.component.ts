import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '@src/app/core/http/upload-file.service';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { IFileData } from '@src/app/shared/models/common-component';
import { HS_BUCKET } from '@src/app/shared/models/system.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  template: `<div>
    <hs-file-upload
      [isFile]="false"
      [multiple]="true"
      fileShowType="form"
      [(fileData)]="fileData"
      [uploadUrl]="'/api/files/upload?bucket=' + bucket + '&path=' + folderName"
      (delItemFile)="delItemFile($event)"
      class="flex-1"
    ></hs-file-upload>
  </div>`,
  imports: [HsUploadFileModule, CommonModule],
})
export class UploadComponent implements OnInit {
  bucket = HS_BUCKET;
  folderName = 'dashboard-background-images';

  fileData: IFileData[] = [
    {
      id: '3765574827472950',
      name: 'images (1).jpg',
      url: '/heartsync-files/dashboard-background-images/images (1).jpg',
    },
    {
      id: '9910068366946026',
      name: 'images (2).jpg',
      url: '/heartsync-files/dashboard-background-images/images (2).jpg',
    },
    {
      id: '9856237437244908',
      name: 'images (3).jpg',
      url: '/heartsync-files/dashboard-background-images/images (3).jpg',
    },
    {
      id: '7173824841164341',
      name: 'squirrel-animal-cute-rodents-47547.jpeg',
      url: '/heartsync-files/dashboard-background-images/squirrel-animal-cute-rodents-47547.jpeg',
    },
  ];

  constructor(
    private toastr: ToastrService,
    private uploadFileService: UploadFileService,
  ) {}

  ngOnInit() {}

  delItemFile(fileItem: IFileData) {
    this.uploadFileService
      .deleteFile(this.bucket, `${this.folderName}/${fileItem.name}`)
      .subscribe((res) => {
        this.toastr.success('删除文件成功!!!', '', {
          positionClass: 'toast-top-center',
        });
      });
  }
}
