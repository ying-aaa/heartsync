import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WidgetTitleBackComponent } from "./widget-title-back.component";

@Component({
  selector: 'hs-widget-design-toolbar',
  templateUrl: './widget-design-toolbar.component.html',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, WidgetTitleBackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetDesignToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);

  showHeaderMenu = signal<boolean>(true);

  constructor(private renderer: Renderer2) {}

  onPreviewCode() {}

  onPreviewWidget() {}

  onSaveWidget() {}

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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.toggleHeaderMenu(false);
  }

  ngOnDestroy(): void {
    this.toggleHeaderMenu(true);
  }
}
