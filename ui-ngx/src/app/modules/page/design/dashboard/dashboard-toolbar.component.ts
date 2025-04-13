import { Component, input, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';

@Component({
  selector: 'hs-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.css'],
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class DashboardToolbarComponent implements OnInit {
  sidenavStart = input.required<MatSidenav>();
  sidenavEnd = input.required<MatSidenav>();

  constructor(private dashboardEditorService: DashboardEditorService) {}

  ngOnInit() {}

  toggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
    this.dashboardEditorService.resizeGridster();
  }

  resizeGridster() {
    this.dashboardEditorService.resizeGridster;
  }
}
