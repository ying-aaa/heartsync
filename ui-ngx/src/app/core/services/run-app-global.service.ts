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

  appGlobalConfig = signal<IAppGlobalConfig>({
    // appLayoutType: '',
    // globalContainerStyle: {
    //   backgroundImage: [
    //     {
    //       id: '6948379030027798',
    //       name: 'image_2024_1_20_910.jpg',
    //       status: 'done',
    //       url: '/heartsync-files/business-image/64fe7240-fb7d-4cac-87b6-ca0292fdb08f.jpg',
    //     },
    //   ],
    // },
    // customAppGlobalCssText:
    //   '.hs-run-app-container{\n    background-attachment: scroll;\n    background-position: 0% 0%;\n    background-repeat: no-repeat;\n    background-color: transparent;\n    background-size: cover;\n}\n.hs-menu-container{\n  backdrop-filter: blur(20px);\n}',
  } as IAppGlobalConfig);

  appMenuConfig = signal<IAppMenuConfig>({
    // menuThemeId: '2',
    // parentMenuItemStyle: {
    //   default: {
    //     fontSizeUnits: 'px',
    //     borderTopWidthUnits: 'px',
    //     borderRightWidthUnits: 'px',
    //     borderBottomWidthUnits: 'px',
    //     borderLeftWidthUnits: 'px',
    //     paddingTopUnits: 'px',
    //     paddingRightUnits: 'px',
    //     paddingBottomUnits: 'px',
    //     paddingLeftUnits: 'px',
    //     borderTopLeftRadiusUnits: 'px',
    //     borderTopRightRadiusUnits: 'px',
    //     borderBottomRightRadiusUnits: 'px',
    //     borderBottomLeftRadiusUnits: 'px',
    //     heightUnits: 'px',
    //     fontSize: 14,
    //     height: 38,
    //     color: 'rgb(255,255,255)',
    //     borderTopLeftRadius: 8,
    //     borderTopRightRadius: 8,
    //     borderBottomRightRadius: 8,
    //     borderBottomLeftRadius: 8,
    //   },
    //   hover: {
    //     fontSizeUnits: 'px',
    //     borderTopWidthUnits: 'px',
    //     borderRightWidthUnits: 'px',
    //     borderBottomWidthUnits: 'px',
    //     borderLeftWidthUnits: 'px',
    //     paddingTopUnits: 'px',
    //     paddingRightUnits: 'px',
    //     paddingBottomUnits: 'px',
    //     paddingLeftUnits: 'px',
    //     borderTopLeftRadiusUnits: 'px',
    //     borderTopRightRadiusUnits: 'px',
    //     borderBottomRightRadiusUnits: 'px',
    //     borderBottomLeftRadiusUnits: 'px',
    //     heightUnits: 'px',
    //     backgroundColor: '#3a4560',
    //     height: 38,
    //   },
    //   active: {
    //     fontSizeUnits: 'px',
    //     borderTopWidthUnits: 'px',
    //     borderRightWidthUnits: 'px',
    //     borderBottomWidthUnits: 'px',
    //     borderLeftWidthUnits: 'px',
    //     paddingTopUnits: 'px',
    //     paddingRightUnits: 'px',
    //     paddingBottomUnits: 'px',
    //     paddingLeftUnits: 'px',
    //     borderTopLeftRadiusUnits: 'px',
    //     borderTopRightRadiusUnits: 'px',
    //     borderBottomRightRadiusUnits: 'px',
    //     borderBottomLeftRadiusUnits: 'px',
    //     heightUnits: 'px',
    //     backgroundColor: '#3a4560',
    //     height: 38,
    //   },
    // },
    // childMenuItemStyle: {
    //   default: {
    //     fontSizeUnits: 'px',
    //     borderTopWidthUnits: 'px',
    //     borderRightWidthUnits: 'px',
    //     borderBottomWidthUnits: 'px',
    //     borderLeftWidthUnits: 'px',
    //     paddingTopUnits: 'px',
    //     paddingRightUnits: 'px',
    //     paddingBottomUnits: 'px',
    //     paddingLeftUnits: 'px',
    //     borderTopLeftRadiusUnits: 'px',
    //     borderTopRightRadiusUnits: 'px',
    //     borderBottomRightRadiusUnits: 'px',
    //     borderBottomLeftRadiusUnits: 'px',
    //     heightUnits: 'px',
    //     fontSize: 14,
    //     height: 38,
    //     color: 'rgb(255,255,255)',
    //     borderTopLeftRadius: 8,
    //     borderTopRightRadius: 8,
    //     borderBottomRightRadius: 8,
    //     borderBottomLeftRadius: 8,
    //   },
    //   hover: {
    //     fontSizeUnits: 'px',
    //     borderTopWidthUnits: 'px',
    //     borderRightWidthUnits: 'px',
    //     borderBottomWidthUnits: 'px',
    //     borderLeftWidthUnits: 'px',
    //     paddingTopUnits: 'px',
    //     paddingRightUnits: 'px',
    //     paddingBottomUnits: 'px',
    //     paddingLeftUnits: 'px',
    //     borderTopLeftRadiusUnits: 'px',
    //     borderTopRightRadiusUnits: 'px',
    //     borderBottomRightRadiusUnits: 'px',
    //     borderBottomLeftRadiusUnits: 'px',
    //     heightUnits: 'px',
    //     backgroundColor: '#3a4560',
    //     height: 38,
    //   },
    //   active: {
    //     fontSizeUnits: 'px',
    //     borderTopWidthUnits: 'px',
    //     borderRightWidthUnits: 'px',
    //     borderBottomWidthUnits: 'px',
    //     borderLeftWidthUnits: 'px',
    //     paddingTopUnits: 'px',
    //     paddingRightUnits: 'px',
    //     paddingBottomUnits: 'px',
    //     paddingLeftUnits: 'px',
    //     borderTopLeftRadiusUnits: 'px',
    //     borderTopRightRadiusUnits: 'px',
    //     borderBottomRightRadiusUnits: 'px',
    //     borderBottomLeftRadiusUnits: 'px',
    //     heightUnits: 'px',
    //     backgroundColor: '#3a4560',
    //     height: 38,
    //   },
    // },
    // menuContainerStyle: {
    //   backgroundColor: 'rgba(44,53,76,.2)',
    //   width: 225,
    //   paddingTopUnits: 'px',
    //   paddingRightUnits: 'px',
    //   paddingBottomUnits: 'px',
    //   paddingLeftUnits: 'px',
    //   widthUnits: 'px',
    //   paddingTop: 8,
    //   paddingRight: 8,
    //   paddingBottom: 8,
    //   paddingLeft: 8,
    //   levelPadding: 20,
    // },
  } as IAppMenuConfig);

  appHeaderConfig = signal<IAppHeaderConfig>({
    // headerContainerStyle: {
    //   height: 54,
    //   paddingTopUnits: 'px',
    //   paddingRightUnits: 'px',
    //   paddingBottomUnits: 'px',
    //   paddingLeftUnits: 'px',
    //   heightUnits: 'px',
    //   paddingRight: 10,
    //   paddingLeft: 10,
    //   backgroundColor: 'rgba(106, 130, 199, 0.2)',
    //   color: 'rgb(255, 255, 255)',
    // },
    // headerContentItems: [
    //   {
    //     type: 'logo',
    //     styles: {
    //       widthType: 'width',
    //       widthUnits: 'fit-content',
    //       width: '',
    //     },
    //   },
    //   {
    //     type: 'placeholder',
    //     styles: {
    //       widthType: 'width',
    //       widthUnits: 'px',
    //       width: '100',
    //     },
    //   },
    //   {
    //     type: 'placeholder',
    //     styles: {
    //       widthType: 'flex',
    //       flex: 1,
    //       widthUnits: 'px',
    //       width: '100',
    //     },
    //   },
    //   {
    //     type: 'placeholder',
    //     styles: {
    //       widthType: 'flex',
    //       flex: 1,
    //       widthUnits: 'px',
    //       width: '100',
    //     },
    //   },
    //   {
    //     type: 'logo',
    //     styles: {
    //       widthType: 'width',
    //       widthUnits: 'fit-content',
    //       width: '',
    //     },
    //   },
    // ],
  } as IAppHeaderConfig);

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
