import {
  AfterViewInit,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  flatWidgetTypesList,
  WidgetEditorService,
} from '@src/app/core/services/widget-editor.service';
import { Router } from '@angular/router';
import { matchSubstring } from '@src/app/core/utils';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'hs-widget-title-back',
  templateUrl: './widget-title-back.component.html',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class WidgetTitleBackComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);

  showHeaderMenu = signal<boolean>(true);

  constructor(
    public widgetEditorService: WidgetEditorService,
    private router: Router,
    private renderer: Renderer2,
  ) {}

  activeWidgetTypeName = computed(() =>
    flatWidgetTypesList.get(this.widgetEditorService.widgetType()),
  );

  activeWidgetName = computed(() => {
    return this.widgetEditorService.widgetConfig().name;
  });

  toWidgetManage() {
    const currentUrl = this.router.url;
    const toUrl = matchSubstring(currentUrl, '/design', '/widget');
    this.router.navigate([toUrl]);
  }

  toggleHeaderMenu(is: boolean) {
    // 隐藏或展示元素 hs-workbench-header
    this.showHeaderMenu.set(is);
    const headerMenu = this.doc.querySelector('hs-workbench-header');
    if (headerMenu) {
      if (this.showHeaderMenu()) {
        this.renderer.removeClass(headerMenu, 'hidden');
      } else {
        this.renderer.addClass(headerMenu, 'hidden');
      }
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.toggleHeaderMenu(false);
  }

  ngOnDestroy(): void {
    this.toggleHeaderMenu(true);
  }
}
