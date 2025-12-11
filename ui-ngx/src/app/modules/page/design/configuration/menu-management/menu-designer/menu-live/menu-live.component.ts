import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MenuDesignerService } from '../menu-deisgner.sevice';
import { camelToKebabCase } from '@src/app/core/utils';
import { MenuManagementService } from '../../menu-management.sevice';
import { IEventsType } from '@src/app/shared/models/public-api';
import { CommonModule } from '@angular/common';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { SideMenuComponent } from '@src/app/modules/page/run-app/menu/side-menu.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

@Component({
  selector: 'hs-menu-live',
  templateUrl: './menu-live.component.html',
  imports: [CommonModule, SideMenuComponent],
})
export class MenuLiveComponent implements OnInit, AfterViewInit, OnDestroy {
  nodes = input<any>();

  styleTag: any;

  event = new Map<
    HTMLElement,
    {
      [key in IEventsType]?: Function;
    }
  >();

  concatUnitsPipe = new ConcatUnitsPipe();

  private readonly doc = inject(DOCUMENT);

  constructor(
    private menuDeSignerService: MenuDesignerService,
    private menuManagementService: MenuManagementService,
    private rootEl: ElementRef,
    private runappMenuService: RunAppMenuService,
  ) {
    this.runappMenuService.setDesignMode();
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
    const globalMenuConfig = this.menuManagementService.globalMenuConfig();
    const childrenDefault = this.transform(globalMenuConfig.children?.default || {});
    const childrenHover = this.transform(globalMenuConfig.children?.hover || {});
    const childrenActive = this.transform(globalMenuConfig.children?.active || {});
    const parentDefault = this.transform(globalMenuConfig.parent?.default || {});
    const parentHover = this.transform(globalMenuConfig.parent?.hover || {});
    const parentActive = this.transform(globalMenuConfig.parent?.active || {});
    const menuContainer = this.transform(globalMenuConfig.menuContainer || {});

    const customStyle = globalMenuConfig.customStyle;

    this.styleTag = this.styleTag || this.doc.querySelector('style[id="menu-dynamic-style"]');

    if (!this.styleTag) {
      this.styleTag = this.doc.createElement('style');
      this.styleTag.id = 'menu-dynamic-style';
      this.doc.head.appendChild(this.styleTag);
    }

    this.styleTag.textContent = `
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

  initEvent() {
    this.event.set(this.rootEl.nativeElement, {
      [IEventsType.MouseMove]: this.onMouseMove.bind(this),
    });

    for (const [el, evnets] of this.event) {
      for (const [eventName, eventFun] of Object.entries(evnets)) {
        // @ts-ignore
        el.addEventListener(eventName, eventFun);
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    this.menuDeSignerService.onMouseMove(event);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initEvent();
  }

  ngOnDestroy(): void {
    for (const [el, evnets] of this.event) {
      for (const [eventName, eventFun] of Object.entries(evnets)) {
        // @ts-ignore
        el.removeEventListener(eventName, eventFun);
      }
    }
  }
}
