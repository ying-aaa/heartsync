import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  Route,
  Data,
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
  styleUrls: ['./hs-breadcrumb.component.scss'],
  imports: [MatIconModule, CommonModule, RouterModule],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  // 输入属性
  @Input() autoGenerate: boolean = true;
  @Input() breadcrumbs: Route[] = [];
  @Input() useRouterLink: boolean = true;
  @Input() showIcons: boolean = false;
  @Input() separator: string = '/';

  // 内部使用的面包屑项数组
  breadcrumbSections = signal<IBreadcrumbSections[]>([]);

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (this.autoGenerate) {
      this.generateBreadcrumbs();
      this.routerSubscription = this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd,
          ),
        )
        .subscribe(() => {
          this.generateBreadcrumbs();
        });
    } else {
    }
  }

  // 从当前路由自动生成面包屑
  private generateBreadcrumbs(): void {
    const routerPathConfig = getRoutePathSegments(this.route);
    const breadcrumbSections =
      this.convertRouterPathConfigToBreadcrumbs(routerPathConfig);
    this.breadcrumbSections.set(breadcrumbSections);
  }

  // 路由配置转面包屑配置
  convertRouterPathConfigToBreadcrumbs(
    routerPathConfig: Route[],
  ): IBreadcrumbSections[] {
    const breadcrumbSections = routerPathConfig.map((route) => ({
      label: route.title as string,
      path: route.path as string,
      icon: route.data?.['icon'],
    }));
    return breadcrumbSections;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
