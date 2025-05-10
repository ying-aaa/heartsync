import { Component, input, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import { WidgetPresetListComponent } from './widget-preset-list.component';
import { DashboardSettingsComponent } from './dashboard-settings.component';
import { VerseDesignModeSwitchComponent } from '@shared/components/ui-verse/verse-design-mode-switch/verse-design-mode-switch.component';
import { FormsModule } from '@angular/forms';

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
    DashboardSettingsComponent,
    VerseDesignModeSwitchComponent,
  ],
})
export class DashboardToolbarComponent implements OnInit {
  sidenavStart = input.required<MatSidenav>();
  sidenavEnd = input.required<MatSidenav>();

  toggleState = true;

  constructor(public dashboardEditorService: DashboardEditorService) {}

  ngOnInit() {}

  toggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
    this.dashboardEditorService.resizeGridster();
  }

  resizeGridster() {
    this.dashboardEditorService.resizeGridster;
  }
}
