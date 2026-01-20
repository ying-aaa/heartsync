import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable, signal } from '@angular/core';
import { MediaBreakpoints } from '@src/app/shared/models/constants';
import { isMobile } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  isMobile = signal(isMobile());

  isTabletScreen = signal(false);

  isPcScreen = signal(!isMobile());

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([MediaBreakpoints['lt-sm'], MediaBreakpoints['gt-sm']])
      .subscribe((res: BreakpointState) => {
        const isMobileScreen = this.breakpointObserver.isMatched(MediaBreakpoints['lt-sm']);
        const isPcScreen = this.breakpointObserver.isMatched(MediaBreakpoints['gt-sm']);
        const isTabletScreen = !isMobileScreen && !isPcScreen;

        this.isMobile.set(isMobileScreen);
        this.isTabletScreen.set(isTabletScreen);
        this.isPcScreen.set(isPcScreen);
      });
  }
}
