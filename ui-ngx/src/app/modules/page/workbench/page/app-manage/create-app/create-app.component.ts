import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationService, CreateApplicationDto } from '@src/app/core/http/application.service';
import { UploadFileService } from '@src/app/core/http/upload-file.service';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { IFileData } from '@src/app/shared/models/common-component';
import { HS_BUCKET } from '@src/app/shared/models/system.model';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'hs-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.less'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    HsUploadFileModule,
    NgScrollbarModule,
    MatRadioModule,
    MatAccordion,
    MatExpansionModule,
  ],
})
export class CreateAppComponent implements OnInit {
  bucket = HS_BUCKET;
  folderName = 'application';

  appForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    versionName: new FormControl('初始版本', Validators.required),
    versionCode: new FormControl('V1.0.0', Validators.required),
    themeId: new FormControl('default'),
  });

  fileList: IFileData[] = [];

  themesList = [
    {
      label: '默认主题',
      value: 'default',
      thumbnail:
        '/heartsync-files/19d0a4ca-2e93-4ac0-9301-900e803f95a8/08d9a9f2-9db4-4d1b-b441-9f406484a6db.jpg',
    },
    {
      label: '璀璨灯火',
      value: 'brilliant-light',
      thumbnail:
        '/heartsync-files/19d0a4ca-2e93-4ac0-9301-900e803f95a8/b5820166-9ef5-40c4-afb2-f2c703d60e12.jpg',
    },
    {
      label: '极光夜空',
      value: 'aurora-night',
      thumbnail:
        '/heartsync-files/19d0a4ca-2e93-4ac0-9301-900e803f95a8/655ecd93-6702-49a2-80bc-4b2ac943521b.jpg',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { directoryId: string },
    private hsThemeService: HsThemeService,
    private applicationService: ApplicationService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateAppComponent>,
    private uploadFileService: UploadFileService,
  ) {}

  delItemFile(fileItem: IFileData) {
    this.uploadFileService
      .deleteFile(this.bucket, `${this.folderName}/${fileItem.name}`)
      .subscribe((res) => {
        this._snackBar.open('删除文件成功!!!', '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1 * 1000,
        });
      });
  }

  matRippleColor = () => this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  submit(): void {
    if (this.appForm.valid) {
      const createApplicationData: CreateApplicationDto = {
        directoryId: this.data.directoryId,
        ...this.appForm.value,
      } as CreateApplicationDto;

      if (this.fileList[0]?.url) {
        createApplicationData.imageUrl = this.fileList[0].url;
      }

      this.applicationService.createApplication(createApplicationData).subscribe((appData) => {
        this._snackBar.open('新增应用成功!!!', '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
        this.dialogRef.close(appData);
      });
    } else {
      // 如果表单无效，显示错误提示
    }
  }

  ngOnInit() {}
}
