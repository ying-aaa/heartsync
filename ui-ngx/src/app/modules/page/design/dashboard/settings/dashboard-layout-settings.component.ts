import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GridType, DisplayGrid } from 'angular-gridster2';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';

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
  ],
  host: {
    class: 'block h-40px',
  },
})
export class DashboardLayoutSettingsComponent implements OnInit {
  form: FormGroup;

  gridTypes = Object.values(GridType);
  displayGrid = Object.values(DisplayGrid);

  constructor(
    private fb: FormBuilder,
    private dashboardConfigService: DashboardConfigService,
    private dialogRef: MatDialogRef<DashboardLayoutSettingsComponent>,
  ) {
    this.form = this.fb.group({
      gridType: [GridType.Fit],
      margin: [10],
      displayGrid: [DisplayGrid.OnDragAndResize],
      enableOccupiedCellDrop: [false],
      emptyCellDragMaxCols: [50],
      emptyCellDragMaxRows: [50],
      minRows: [3],
      maxRows: [3],
      minCols: [1],
      maxCols: [1],
    });

    this.form.valueChanges.subscribe((v) => {
      console.log('%c Line:53 🥝 v', 'color:#42b983', v);
    });
  }

  saveConfig() {
    const config = this.form.value;
    // 在这里可以将配置保存到服务或发送到后端
    this.dashboardConfigService.updateGridsterOption(config);
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // 初始化设置form的值
    const gridsterOption = this.dashboardConfigService.gridsterOption();
    this.form.patchValue(gridsterOption!);
  }
}
