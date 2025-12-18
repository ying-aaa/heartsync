import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { camelToKebabCase, getImageUrl } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class RunAppGlobalService {
  private readonly doc = inject(DOCUMENT);

  styleTag: HTMLStyleElement;

  appGlobalConfig = signal<any>({
    globalStyles: {
      backgroundImage: [
        {
          id: '6948379030027798',
          name: 'image_2024_1_20_910.jpg',
          status: 'done',
          url: '/heartsync-files/business-image/64fe7240-fb7d-4cac-87b6-ca0292fdb08f.jpg',
        },
      ],
    },
    customStyle:
      '.hs-run-app-container{\n    background-attachment: scroll;\n    background-position: 0% 0%;\n    background-repeat: no-repeat;\n    background-color: transparent;\n    background-size: cover;\n}\n.hs-menu-container{\n  backdrop-filter: blur(20px);\n}',
  });

  appMenuConfig = signal({
    themeId: '2',
    parent: {
      default: {
        fontSizeUnits: 'px',
        borderTopWidthUnits: 'px',
        borderRightWidthUnits: 'px',
        borderBottomWidthUnits: 'px',
        borderLeftWidthUnits: 'px',
        paddingTopUnits: 'px',
        paddingRightUnits: 'px',
        paddingBottomUnits: 'px',
        paddingLeftUnits: 'px',
        borderTopLeftRadiusUnits: 'px',
        borderTopRightRadiusUnits: 'px',
        borderBottomRightRadiusUnits: 'px',
        borderBottomLeftRadiusUnits: 'px',
        heightUnits: 'px',
        fontSize: 14,
        height: 38,
        color: 'rgb(255,255,255)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
      },
      hover: {
        fontSizeUnits: 'px',
        borderTopWidthUnits: 'px',
        borderRightWidthUnits: 'px',
        borderBottomWidthUnits: 'px',
        borderLeftWidthUnits: 'px',
        paddingTopUnits: 'px',
        paddingRightUnits: 'px',
        paddingBottomUnits: 'px',
        paddingLeftUnits: 'px',
        borderTopLeftRadiusUnits: 'px',
        borderTopRightRadiusUnits: 'px',
        borderBottomRightRadiusUnits: 'px',
        borderBottomLeftRadiusUnits: 'px',
        heightUnits: 'px',
        backgroundColor: '#3a4560',
        height: 38,
      },
      active: {
        fontSizeUnits: 'px',
        borderTopWidthUnits: 'px',
        borderRightWidthUnits: 'px',
        borderBottomWidthUnits: 'px',
        borderLeftWidthUnits: 'px',
        paddingTopUnits: 'px',
        paddingRightUnits: 'px',
        paddingBottomUnits: 'px',
        paddingLeftUnits: 'px',
        borderTopLeftRadiusUnits: 'px',
        borderTopRightRadiusUnits: 'px',
        borderBottomRightRadiusUnits: 'px',
        borderBottomLeftRadiusUnits: 'px',
        heightUnits: 'px',
        backgroundColor: '#3a4560',
        height: 38,
      },
    },
    children: {
      default: {
        fontSizeUnits: 'px',
        borderTopWidthUnits: 'px',
        borderRightWidthUnits: 'px',
        borderBottomWidthUnits: 'px',
        borderLeftWidthUnits: 'px',
        paddingTopUnits: 'px',
        paddingRightUnits: 'px',
        paddingBottomUnits: 'px',
        paddingLeftUnits: 'px',
        borderTopLeftRadiusUnits: 'px',
        borderTopRightRadiusUnits: 'px',
        borderBottomRightRadiusUnits: 'px',
        borderBottomLeftRadiusUnits: 'px',
        heightUnits: 'px',
        fontSize: 14,
        height: 38,
        color: 'rgb(255,255,255)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
      },
      hover: {
        fontSizeUnits: 'px',
        borderTopWidthUnits: 'px',
        borderRightWidthUnits: 'px',
        borderBottomWidthUnits: 'px',
        borderLeftWidthUnits: 'px',
        paddingTopUnits: 'px',
        paddingRightUnits: 'px',
        paddingBottomUnits: 'px',
        paddingLeftUnits: 'px',
        borderTopLeftRadiusUnits: 'px',
        borderTopRightRadiusUnits: 'px',
        borderBottomRightRadiusUnits: 'px',
        borderBottomLeftRadiusUnits: 'px',
        heightUnits: 'px',
        backgroundColor: '#3a4560',
        height: 38,
      },
      active: {
        fontSizeUnits: 'px',
        borderTopWidthUnits: 'px',
        borderRightWidthUnits: 'px',
        borderBottomWidthUnits: 'px',
        borderLeftWidthUnits: 'px',
        paddingTopUnits: 'px',
        paddingRightUnits: 'px',
        paddingBottomUnits: 'px',
        paddingLeftUnits: 'px',
        borderTopLeftRadiusUnits: 'px',
        borderTopRightRadiusUnits: 'px',
        borderBottomRightRadiusUnits: 'px',
        borderBottomLeftRadiusUnits: 'px',
        heightUnits: 'px',
        backgroundColor: '#3a4560',
        height: 38,
      },
    },
    menuContainer: {
      backgroundColor: 'rgba(44,53,76,.2)',
      width: 225,
      paddingTopUnits: 'px',
      paddingRightUnits: 'px',
      paddingBottomUnits: 'px',
      paddingLeftUnits: 'px',
      widthUnits: 'px',
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      levelPadding: 20,
    },
    showType: 'menuContainer',
  });

  appHeaderConfig = signal({
    headerStyle: {
      height: 54,
      paddingTopUnits: 'px',
      paddingRightUnits: 'px',
      paddingBottomUnits: 'px',
      paddingLeftUnits: 'px',
      heightUnits: 'px',
      paddingRight: 10,
      paddingLeft: 10,
      backgroundColor: 'rgba(106, 130, 199, 0.2)',
      color: 'rgb(255, 255, 255)',
    },
    contentGroups: [
      {
        type: 'logo',
        styles: {
          widthType: 'width',
          widthUnits: 'fit-content',
          width: '',
        },
      },
      {
        type: 'placeholder',
        styles: {
          widthType: 'width',
          widthUnits: 'px',
          width: '100',
        },
      },
      {
        type: 'placeholder',
        styles: {
          widthType: 'flex',
          flex: 1,
          widthUnits: 'px',
          width: '100',
        },
      },
      {
        type: 'placeholder',
        styles: {
          widthType: 'flex',
          flex: 1,
          widthUnits: 'px',
          width: '100',
        },
      },
      {
        type: 'logo',
        styles: {
          widthType: 'width',
          widthUnits: 'fit-content',
          width: '',
        },
      },
    ],
  });

  constructor() {
    effect(() => {
      this.drawCss();
    });
  }

  transform(styles: any): string {
    let styleStr = '';

    Object.keys(styles).forEach((key) => {
      const unitKey = `${key}Units`;
      const hyphenKey = camelToKebabCase(key);
      const value = styles[key];
      if (styles.hasOwnProperty(unitKey)) {
        styleStr += `${hyphenKey}: ${value}${styles[unitKey]};`;
      } else if (!key.endsWith('Units')) {
        if (key === 'backgroundImage') {
          styleStr += `${hyphenKey}: url(${getImageUrl(value)});`;
        } else {
          styleStr += `${hyphenKey}: ${value};`;
        }
      }
    });
    return styleStr;
  }

  drawCss() {
    const menuConfig = this.appMenuConfig();
    const childrenDefault = this.transform(menuConfig.children?.default || {});
    const childrenHover = this.transform(menuConfig.children?.hover || {});
    const childrenActive = this.transform(menuConfig.children?.active || {});
    const parentDefault = this.transform(menuConfig.parent?.default || {});
    const parentHover = this.transform(menuConfig.parent?.hover || {});
    const parentActive = this.transform(menuConfig.parent?.active || {});
    const menuContainer = this.transform(menuConfig.menuContainer || {});

    const headerConfig = this.appHeaderConfig();
    const headerStyle = this.transform(headerConfig.headerStyle || {});

    const appGlobalConfig = this.appGlobalConfig();
    const globalStyles = this.transform(appGlobalConfig.globalStyles);

    const customStyle = appGlobalConfig.customStyle;

    this.styleTag = this.styleTag || this.doc.querySelector('style[id="hs-app-dynamic-style"]');

    if (!this.styleTag) {
      this.styleTag = this.doc.createElement('style');
      this.styleTag.id = 'hs-app-dynamic-style';
      this.doc.head.appendChild(this.styleTag);
    }

    this.styleTag.textContent = `
        .hs-run-app-container{
          ${globalStyles}
        }
        .hs-header-container{
          ${headerStyle}}
        .hs-menu-container{
          ${menuContainer}
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
        ${customStyle}
      `;
  }
}
