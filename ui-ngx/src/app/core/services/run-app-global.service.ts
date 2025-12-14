import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { camelToKebabCase } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class RunAppGlobalService {
  private readonly doc = inject(DOCUMENT);

  styleTag: HTMLStyleElement;

  appGlobalConfig = signal<any>({});

  appMenuConfig = signal({
    themeId: '2',
    customStyle: '',
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
      backgroundColor: 'rgb(44,53,76)',
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
      backgroundColor: '#eee',
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
          widthType: 'flex',
          flex: 1,
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

  transform(value: any): string {
    let styleStr = '';

    Object.keys(value).forEach((key) => {
      const unitKey = `${key}Units`;
      const hyphenKey = camelToKebabCase(key);
      if (value.hasOwnProperty(unitKey)) {
        styleStr += `${hyphenKey}: ${value[key]}${value[unitKey]};`;
      } else if (!key.endsWith('Units')) {
        styleStr += `${hyphenKey}: ${value[key]};`;
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

    const customStyle = menuConfig.customStyle;

    this.styleTag = this.styleTag || this.doc.querySelector('style[id="menu-dynamic-style"]');

    if (!this.styleTag) {
      this.styleTag = this.doc.createElement('style');
      this.styleTag.id = 'menu-dynamic-style';
      this.doc.head.appendChild(this.styleTag);
    }

    this.styleTag.textContent = `
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
