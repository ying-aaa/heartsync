import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GridType, DisplayGrid } from 'angular-gridster2';
console.log('%c Line:9 🥕 GridType', 'color:#2eafb0', GridType);
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { IFileData } from '@src/app/shared/models/common-component';
import { HS_BUCKET } from '@src/app/shared/models/system.model';
import { UploadFileService } from '@src/app/core/http/upload-file.service';
import { ToastrService } from 'ngx-toastr';
import { deepClone } from '@src/app/core/utils';
import { HsColorPickerComponent } from '@src/app/shared/components/hs-color-picker/hs-color-picker.component';
import {
  backgroundImageModeOptions,
  displayGridOptions,
  gridTypeOptions,
} from '@src/app/shared/models/constants';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'hs-dashboard-layout-settings',
  templateUrl: './dashboard-layout-settings.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    HsUploadFileModule,
    HsColorPickerComponent,
    MatTooltipModule,
  ],
  host: {
    class: 'block h-40px',
  },
})
export class DashboardLayoutSettingsComponent implements OnInit {
  bucket = HS_BUCKET;
  folderName = 'dashboard-background-images';

  form: FormGroup;

  fileList: IFileData[] = [];

  gridTypeOptions = gridTypeOptions;
  displayGridOptions = displayGridOptions;
  backgroundImageModeOptions = backgroundImageModeOptions;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private uploadFileService: UploadFileService,
    private dashboardConfigService: DashboardConfigService,
    private dialogRef: MatDialogRef<DashboardLayoutSettingsComponent>,
  ) {
    this.form = this.fb.group({
      gridType: [GridType.Fit],
      margin: [10],
      outerMargin: [true],
      displayGrid: [DisplayGrid.OnDragAndResize],
      enableOccupiedCellDrop: [true],
      minRows: [1],
      minCols: [1],
      backgroundColor: ['transparent'],
      backgroundSize: ['cover'],
    });

    this.form.valueChanges.subscribe((v) => {
      console.log('%c Line:53 🥝 v', 'color:#42b983', v);
    });
  }

  delItemFile(fileItem: IFileData) {
    this.uploadFileService
      .deleteFile(this.bucket, `${this.folderName}/${fileItem.name}`)
      .subscribe((res) => {
        this.toastr.success('删除文件成功!!!', '', {
          positionClass: 'toast-top-center',
        });
      });
  }

  cancel() {
    const gridsterOption = this.dashboardConfigService.gridsterOption();
    const backgroundImageFileData = deepClone(gridsterOption?.['backgroundImageFileData'] || []);
    this.fileList.forEach((fileItem) => {
      if (!backgroundImageFileData.some((item: IFileData) => item.name === fileItem.name)) {
        this.delItemFile(fileItem);
      }
    });
    this.dialogRef.close();
  }

  saveConfig() {
    const config = this.form.value;
    if (this.fileList[0]?.url) {
      config.backgroundImageFileData = this.fileList;
    }
    this.dashboardConfigService.updateGridsterOption(config);
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // 初始化设置form的值
    const gridsterOption = this.dashboardConfigService.gridsterOption();
    this.form.patchValue(gridsterOption!);
    this.fileList = deepClone(gridsterOption?.['backgroundImageFileData'] || []);
  }
}
