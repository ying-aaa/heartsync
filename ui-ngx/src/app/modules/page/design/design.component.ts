import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { WorkbenchHeaderComponent } from '../common/workbench-header/workbench-header.component';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ApplicationService,
  IAppConfig,
} from '@src/app/core/http/application.service';
import { getParamFromRoute } from '@src/app/core/utils';

@Component({
  selector: 'hs-design',
  templateUrl: './design.component.html',
  imports: [WorkbenchHeaderComponent, RouterModule, MatTooltipModule],
})
export class DesignComponent implements OnInit {
  @ViewChild('outlet', { static: true }) outlet!: RouterOutlet;

  appId: string = getParamFromRoute('appId', this.route)!;

  appConfig = signal<IAppConfig>({} as IAppConfig);
  loadingState = signal<boolean>(false);

  imageUrl = computed(() => this.appConfig().imageUrl);
  name = computed(() => this.appConfig().name);

  hiddenMenu = false;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
  ) {}

  ngOnInit() {
    this.loadAppConfig();
    setTimeout(() => {
      this.onActivate();
    }, 50);
  }

  onActivate() {
    const routeConfig = this.outlet.activatedRoute.routeConfig;
    this.hiddenMenu = routeConfig?.data?.['hiddenMenu'];
  }

  loadAppConfig() {
    this.loadingState.set(true);
    this.applicationService.findApplicationById(this.appId).subscribe(
      (res) => {
        console.log(res);
        this.appConfig.set(res);
        this.loadingState.set(false);
      },
      (err) => {
        this.loadingState.set(false);
      },
    );
  }
}
