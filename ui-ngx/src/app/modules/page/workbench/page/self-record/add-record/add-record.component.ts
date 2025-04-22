import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelfRecordService } from '@src/app/core/http/self-record.service';
import { UploadFileService } from '@src/app/core/http/upload-file.service';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { IFileData } from '@src/app/shared/models/common-component';

@Component({
  selector: 'hs-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.less'],
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
    CommonModule,
  ],
})
export class AddRecordComponent implements OnInit {
  folderName = 'self-record';

  recordForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    fileUrl: new FormControl(''),
    location: new FormControl(''),
    visibility: new FormControl('public'),
  });

  filesData: IFileData[] = [];

  constructor(
    private hsThemeService: HsThemeService,
    private selfRecordService: SelfRecordService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddRecordComponent>,
    private uploadFileService: UploadFileService,
  ) {}

  delItemFile(fileItem: IFileData) {
    this.uploadFileService
      .deleteFile('heartsync', `${this.folderName}/${fileItem.name}`)
      .subscribe((res) => {
        this._snackBar.open('删除文件成功!!!', '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  matRippleColor = () =>
    this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  submit(): void {
    if (this.recordForm.valid) {
      this.selfRecordService
        .create(this.recordForm.value)
        .subscribe((newRecord) => {
          this._snackBar.open('新增记录成功!!!', '确定', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          });
          this.dialogRef.close(newRecord);
        });
    } else {
      // 如果表单无效，显示错误提示
    }
  }

  ngOnInit() {}
}
