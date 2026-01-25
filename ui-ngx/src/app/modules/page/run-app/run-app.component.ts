import { Component, OnInit } from '@angular/core';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { AppLayoutComponent } from './layout/app-layout.component';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'hs-run-app',
  templateUrl: './run-app.component.html',
  styleUrls: ['./run-app.component.less'],
  imports: [RouterModule, MatDividerModule, AppLayoutComponent],
  host: { class: 'hs-run-app-container block wh-full' },
})
export class RunAppComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);

  constructor(
    private route: ActivatedRoute,
    private runAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
  ) {}

  ngOnInit() {
    forkJoin([
      this.runAppGlobalService.loadAppWithConfig(this.appId!),
      this.runAppMenuService.loadAppMenu(this.appId!),
    ]).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
  }
}
