import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { NetworkService } from '../http/network.service';

@Injectable({
  providedIn: 'root',
})
export class OverseasGuard implements CanActivate {
  constructor(
    private networkService: NetworkService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.networkService.isOverseasNetwork().pipe(
      map((isOverseas: any) => {
        if (isOverseas) {
          // 如果是海外网络，允许访问
          return true;
        } else {
          // 如果不是海外网络，重定向到其他页面
          this.router.navigate(['/not-found']);
          return false;
        }
      }),
    );
  }
}
