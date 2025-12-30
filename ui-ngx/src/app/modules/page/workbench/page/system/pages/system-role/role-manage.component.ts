import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { getRoutePathSegments } from '@core/utils';
import { BreadcrumbComponent } from '@src/app/shared/components/hs-breadcrumbs/hs-breadcrumb.component';
import { MatDivider } from '@angular/material/divider';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';

@Component({
  selector: 'hs-system-role',
  template: `
    <content class="wh-full flex p-20px bg-[var(--primary-bg-color)]">
      <aside class="w-250px h-full mr-24px">
        <hs-role-list #RoleList></hs-role-list>
      </aside>
      <main class="flex-1">
        <hs-role-detail [roleId]="RoleList.seletedRoleId()"></hs-role-detail>
      </main>
    </content>
  `,
  imports: [RouterModule, RoleListComponent, RoleDetailComponent],
})
export class SystemRoleComponent implements OnInit, OnDestroy {
  routePaths = signal<Route[]>(getRoutePathSegments(this.route));

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
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
