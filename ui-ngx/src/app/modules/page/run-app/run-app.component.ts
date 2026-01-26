import { Component, computed, OnInit, signal } from '@angular/core';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AppLayoutComponent } from './layout/app-layout.component';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { finalize, forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HsSvgModule } from "@src/app/shared/components/hs-svg/hs-svg.module";
import { AppLogoComponent } from "./common/app-logo/app-logo.component";
import { WorkbenchUserDropdownComponent } from "../common/workbench-header/workbench-user-dropdown/workbench-user-dropdown.component";

@Component({
  selector: 'hs-run-app',
  templateUrl: './run-app.component.html',
  styleUrls: ['./run-app.component.less'],
  imports: [
    RouterModule,
    MatDividerModule,
    AppLayoutComponent,
    MatProgressSpinnerModule,
    HsSvgModule,
    AppLogoComponent,
    WorkbenchUserDropdownComponent
],
  host: { class: 'hs-run-app-container block wh-full' },
})
export class RunAppComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);
  loadingStatus = signal<boolean>(false);

  menuData = computed(() => this.runAppMenuService.menuData());

  constructor(
    private route: ActivatedRoute,
    private runAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
  ) {}

  ngOnInit() {
    this.loadAppAndMenu();
  }

  loadAppAndMenu() {
    this.loadingStatus.set(true);
    forkJoin([
      this.runAppGlobalService.loadAppWithConfig(this.appId!),
      this.runAppMenuService.loadAppMenu(this.appId!),
    ])
      .pipe(
        finalize(() => {
          this.loadingStatus.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.runAppMenuService.navigateToDefaultDashboard();
        },
        error: (err) => {},
      });
  }
}
