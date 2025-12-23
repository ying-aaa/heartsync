import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UploadFileService } from '@src/app/core/http/upload-file.service';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { IFileData } from '@src/app/shared/models/common-component';
import { HS_BUCKET } from '@src/app/shared/models/system.model';
import { ToastrService } from 'ngx-toastr';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';

@Component({
  selector: 'app-upload',
  template: `<div>
    <formly-form [form]="formGroup" [fields]="fields" [options]="options()" [model]="model()">
    </formly-form>

    <div class="h-200px"></div>

    <hs-file-upload
      [multiple]="true"
      fileShowType="detail"
      [(fileList)]="fileList"
      [uploadUrl]="'/api/files/upload?bucket=' + bucket + '&path=' + folderName"
      (delItemFile)="delItemFile($event)"
      [cols]="3"
      [maxCount]="3"
      class="flex-1"
    ></hs-file-upload>
    <div class="h-200px"></div>

    <!-- <hs-file-upload
      [multiple]="true"
      fileShowType="more-detail"
      [(fileList)]="fileList1"
      [uploadUrl]="'/api/files/upload?bucket=' + bucket + '&path=' + folderName"
      (delItemFile)="delItemFile($event)"
      [cols]="3"
      class="flex-1"
    ></hs-file-upload> -->
  </div>`,
  imports: [HsUploadFileModule, CommonModule, FormlyRunModule],
})
export class UploadComponent implements OnInit {
  bucket = HS_BUCKET;
  folderName = 'dashboard-background-images';

  fileList: IFileData[] = [];

  fileList1: IFileData[] = [
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

  fields = [
    {
      key: 'backgroundImage',
      type: 'image-upload',
      defaultValue: [],
      props: { label: '背景图片', description: '请上传图片', maxCount: 1 },
    },
  ];

  options = signal<any>({});

  formGroup = new FormGroup({});

  model = signal<any>({
    backgroundImage: [
      {
        id: '3765574827472950',
        name: 'images (1).jpg',
        url: '/heartsync-files/dashboard-background-images/images (1).jpg',
      },
    ],
  });

  constructor(
    private toastr: ToastrService,
    private uploadFileService: UploadFileService,
  ) {
    this.formGroup.valueChanges.subscribe((newModel) => {
      this.model.set({...this.model()});
    });

    effect(() => {

      console.log("%c Line:106 🥒", "color:#7f2b82", this.model());
    })
  }

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
