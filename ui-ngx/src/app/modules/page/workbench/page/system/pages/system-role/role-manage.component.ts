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
    <content class="wh-full">
      1<hs-breadcrumb></hs-breadcrumb>1
      <nav class="py-12px px-24px">
        @for (item of routePaths(); track $index) {
          <a
            class="text-sm text-gray-500 hover:text-gray-700"
            [routerLink]="item.path"
            >{{ item.title }}</a
          >
          @if ($index < routePaths().length - 1) {
            <span class="mx-3px">/</span>
          }
        }
      </nav>
      <router-outlet></router-outlet>
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
