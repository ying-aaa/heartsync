import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  Route,
  Data,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'hs-breadcrumb',
  templateUrl: './hs-breadcrumb.component.html',
  styleUrls: ['./hs-breadcrumb.component.scss'],
  imports: [MatIconModule, CommonModule, RouterModule],
})
export class BreadcrumbComponent implements OnChanges {
  // 输入属性
  @Input() routes: Route[] = [];
  @Input() useRouterLink: boolean = true;
  @Input() showIcons: boolean = false;
  @Input() separator: string = '/';

  // 内部使用的面包屑项数组
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // 监听路由变化
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.routes || this.routes.length === 0) {
          this.generateBreadcrumbs();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 当传入的路由数组发生变化时
    if (changes['routes'] && this.routes && this.routes.length > 0) {
      this.generateBreadcrumbsFromInput();
    } else {
      this.generateBreadcrumbs();
    }
  }

  // 从当前路由自动生成面包屑
  private generateBreadcrumbs(): void {
    this.breadcrumbItems = [];
    let currentRoute = this.activatedRoute.root;
    let url = '';

    while (currentRoute) {
      const children = currentRoute.children;
      currentRoute = null as any;

      children.forEach((route) => {
        if (route.outlet === 'primary') {
          const routeSnapshot = route.snapshot;
          const routeData = routeSnapshot.data;

          // 添加到面包屑路径
          url += `/${routeSnapshot.url.map((segment) => segment.path).join('/')}`;

          // 检查是否有标题
          if (routeData && routeData['title']) {
            this.breadcrumbItems.push({
              label: routeData['title'],
              path: url,
              icon: routeData['icon'] || null,
            });
          }

          currentRoute = route;
        }
      });
    }
  }

  // 从输入的路由数组生成面包屑
  private generateBreadcrumbsFromInput(): void {
    this.breadcrumbItems = [];
    let path = '';

    this.routes.forEach((route) => {
      if (route.path) {
        path += `/${route.path}`;
      }

      if (route.data && route.data['title']) {
        this.breadcrumbItems.push({
          label: route.data['title'],
          path: path,
          icon: route.data['icon'] || null,
        });
      }
    });
  }
}

// 面包屑项接口
interface BreadcrumbItem {
  label: string;
  path: string;
  icon: string | null;
}
