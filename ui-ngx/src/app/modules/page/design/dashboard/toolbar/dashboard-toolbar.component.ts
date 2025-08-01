import { Component, input, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import { WidgetPresetListComponent } from './widget-preset-list.component';
// import { VerseDesignModeSwitchComponent } from '@shared/components/ui-verse/verse-design-mode-switch/verse-design-mode-switch.component';
import { FormsModule } from '@angular/forms';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { isMobile } from '@src/app/core/utils';
import { MatDialog } from '@angular/material/dialog';
import { DashboardLayoutSettingsComponent } from '../settings/dashboard-layout-settings.component';

@Component({
  selector: 'hs-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.less'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    WidgetPresetListComponent,
    // VerseDesignModeSwitchComponent,
  ],
})
export class DashboardToolbarComponent implements OnInit {
  sidenavStart = input.required<MatSidenav>();
  sidenavEnd = input.required<MatSidenav>();

  toggleState = true;

  isRuntime = this.dashboardEditorService.isRuntime;

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
    private dialog: MatDialog,
  ) {}

  // 打开布局设置
  openLayoutSettings() {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(DashboardLayoutSettingsComponent, {
      data: {},
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  // 切换运行时状态
  updateRuntimeStatus(is: boolean) {
    this.dashboardEditorService.updateRuntimeStatus(is);
  }

  // 保存
  saveConfig() {
    this.dashboardConfigService.saveConfig();
    this.updateRuntimeStatus(true);
    this.resizeGridster();
  }

  // 取消
  cancel(is: boolean) {
    this.updateRuntimeStatus(is);
    this.dashboardConfigService.useOriginConfig();
    this.resizeGridster();
  }

  // 侧边栏显隐
  toggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
    this.resizeGridster();
  }

  // 重置网格
  resizeGridster() {
    this.dashboardEditorService.resizeGridster();
  }

  ngOnInit() {}
}
