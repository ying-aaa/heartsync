import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { deepClone, transformCss } from '../utils';
import { ApplicationService } from '../http/application.service';
import { tap } from 'rxjs';
import { IAppGlobalConfig, IAppHeaderConfig, IAppMenuConfig } from '@heartsync/types';

@Injectable()
export class RunAppGlobalService {
  private readonly doc = inject(DOCUMENT);

  appId = '';

  styleTag: HTMLStyleElement;

  appData = signal<any>({});

  appGlobalConfig = signal<IAppGlobalConfig>({} as IAppGlobalConfig);

  appMenuConfig = signal<IAppMenuConfig>({} as IAppMenuConfig);

  appHeaderConfig = signal<IAppHeaderConfig>({} as IAppHeaderConfig);

  constructor(private applicationService: ApplicationService) {
    effect(() => {
      this.drawCss();
    });
  }

  drawCss() {
    const menuConfig = this.appMenuConfig();
    const childrenDefault = transformCss(menuConfig.childMenuItemStyle?.default || {});
    const childrenHover = transformCss(menuConfig.childMenuItemStyle?.hover || {});
    const childrenActive = transformCss(menuConfig.childMenuItemStyle?.active || {});
    const parentDefault = transformCss(menuConfig.parentMenuItemStyle?.default || {});
    const parentHover = transformCss(menuConfig.parentMenuItemStyle?.hover || {});
    const parentActive = transformCss(menuConfig.parentMenuItemStyle?.active || {});
    const menuContainerStyle = transformCss(menuConfig.menuContainerStyle || {});

    const headerConfig = this.appHeaderConfig();
    const headerContainerStyle = transformCss(headerConfig.headerContainerStyle || {});

    const appGlobalConfig = this.appGlobalConfig();
    const globalContainerStyle = transformCss(appGlobalConfig.globalContainerStyle);

    const customAppGlobalCssText = appGlobalConfig.customAppGlobalCssText;

    this.styleTag = this.styleTag || this.doc.querySelector('style[id="hs-app-dynamic-style"]');

    if (!this.styleTag) {
      this.styleTag = this.doc.createElement('style');
      this.styleTag.id = 'hs-app-dynamic-style';
      this.doc.head.appendChild(this.styleTag);
    }

    this.styleTag.textContent = `
      #${this.appData().id} {
        .hs-run-app-container{
          ${globalContainerStyle}
        }
        .hs-header-container{
          ${headerContainerStyle}}
        .hs-menu-container{
          ${menuContainerStyle}
        }
        .hs-menu-item-parent {
          ${parentDefault}
        }
        .hs-menu-item-parent:hover {
          ${parentHover}
        }
        .hs-menu-item-parent.hs-menu-active {
          ${parentActive}
        }
        .hs-menu-item-children {
          ${childrenDefault}
        }
        .hs-menu-item-children:hover {
          ${childrenHover}
        }
        .hs-menu-item-children.hs-menu-active {
          ${childrenActive}
        }
        ${customAppGlobalCssText}
      }
    `;

    console.log('%c Line:293 🍎', 'color:#f5ce50', this.styleTag.textContent);
  }

  loadAppWithConfig(appId: string) {
    this.appId = appId;
    return this.applicationService.getAppWithConfigById(appId).pipe(
      tap((res) => {
        this.appData.set(res);
        this.appGlobalConfig.set(deepClone(res.globalConfig));
        this.appMenuConfig.set(deepClone(res.menuConfig));
        this.appHeaderConfig.set(deepClone(res.headerConfig));
      }),
    );
  }

  updateAppWithConfig(appId: string) {
    appId = appId || this.appId;
    const appData = {
      ...this.appData(),
      globalConfig: this.appGlobalConfig(),
      menuConfig: this.appMenuConfig(),
      headerConfig: this.appHeaderConfig(),
    };
    return this.applicationService.updateApplication(appId, appData).pipe(
      tap((res) => {
        this.appData.set(res);
        this.appGlobalConfig.set(deepClone(res.globalConfig));
        this.appMenuConfig.set(deepClone(res.menuConfig));
        this.appHeaderConfig.set(deepClone(res.headerConfig));
      }),
    );
  }
}
