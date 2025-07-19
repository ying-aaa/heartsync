import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  input,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  Route,
  RouterModule,
} from '@angular/router';
import { getRoutePathSegments } from '@src/app/core/utils';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// 面包屑项接口`
interface IBreadcrumbSections {
  label: string;
  path: string;
  icon: string | null;
}
@Component({
  selector: 'hs-breadcrumb',
  templateUrl: './hs-breadcrumb.component.html',
  styleUrls: ['./hs-breadcrumb.component.less'],
  imports: [MatIconModule, CommonModule, RouterModule],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs = input<Route[]>([]);

  @Input() useRouterLink: boolean = true;
  @Input() showIcons: boolean = false;
  @Input() separator: string = '/';

  breadcrumbSections = signal<IBreadcrumbSections[]>([]);

  private routerSubscription!: Subscription;

  autoGenerate = input<Boolean>(true);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      const shouldAuto = this.autoGenerate();
      if (shouldAuto) {
        this.generateBreadcrumbs();
        this.routerSubscription?.unsubscribe();
        this.routerSubscription = this.router.events
          .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
          .subscribe(() => this.generateBreadcrumbs());
      } else {
        this.routerSubscription?.unsubscribe();
        this.generateBreadcrumbs(this.breadcrumbs());
      }
    });
  
    effect(() => {
      if (!this.autoGenerate()) {
        const breadcrumbConfigs = this.breadcrumbs();
        this.generateBreadcrumbs(breadcrumbConfigs);
      }
    });
  }

  // 从当前路由自动生成面包屑
  private generateBreadcrumbs(breadcrumbs?: Route[]): void {
    const routerPathConfig = breadcrumbs || getRoutePathSegments(this.route);
    const breadcrumbSections =
      this.convertRouterPathConfigToBreadcrumbs(routerPathConfig);
    this.breadcrumbSections.set(breadcrumbSections);
  }

  // 路由配置转面包屑配置
  convertRouterPathConfigToBreadcrumbs(
    routerPathConfig: Route[],
  ): IBreadcrumbSections[] {
    let path = this.getParentUrl();
    const breadcrumbSections = routerPathConfig.map((route, index) => {
      const label = route.title as string;
      const icon = route.data?.['icon'];
      path = `${path}/${route.path}`;
      return { label, path, icon };
    });
    return breadcrumbSections;
  }

  getParentUrl(): string {
    const path = this.route.pathFromRoot
      .filter((r) => r.routeConfig?.path)
      .slice(0, -1)
      .map((r) => r.routeConfig!.path)
      .join('/');

    return `/${path}`;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
