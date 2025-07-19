import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { getRoutePathSegments } from '@core/utils';
import { BreadcrumbComponent } from '@src/app/shared/components/hs-breadcrumbs/hs-breadcrumb.component';

@Component({
  selector: 'hs-system-role',
  template: `
    <content class="wh-full flex flex-col">
      <nav class="p-20px">
        <hs-breadcrumb
          [autoGenerate]="false"
          [breadcrumbs]="[
            {
              title: '角色管理',
              path: 'role',
              data: {
                icon: 'role',
              },
              children: [
                {
                  title: '角色列表',
                  path: '',
                },
                {
                  title: '角色详情',
                  path: ':roleId/detail',
                },
              ],
            },
            {
              title: '角色列表',
              path: '',
            },
          ]"
        ></hs-breadcrumb>
      </nav>
      <main class="h-0 flex-1">
        <router-outlet></router-outlet>
      </main>
    </content>
  `,
  imports: [RouterModule, BreadcrumbComponent],
})
export class SystemRoleComponent implements OnInit, OnDestroy {
  routePaths = signal<Route[]>(getRoutePathSegments(this.route));

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        this.updateCurrentPath();
      });
  }

  updateCurrentPath() {
    const currentPath = getRoutePathSegments(this.route);
    this.routePaths.set(currentPath);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
