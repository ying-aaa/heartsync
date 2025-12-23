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
  ],
})
export class CreateAppComponent implements OnInit {
  bucket = HS_BUCKET;
  folderName = 'application';

  appForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  fileList: IFileData[] = [];

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
