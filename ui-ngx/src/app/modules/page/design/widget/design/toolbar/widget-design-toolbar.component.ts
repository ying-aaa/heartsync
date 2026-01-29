import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WidgetTitleBackComponent } from './widget-title-back.component';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';

@Component({
  selector: 'hs-widget-design-toolbar',
  templateUrl: './widget-design-toolbar.component.html',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, WidgetTitleBackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetDesignToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);

  showHeaderMenu = signal<boolean>(true);

  widgetTypeService = computed(() => this.widgetEditorService.widgetTypeService()!);

  constructor(
    private dialog: MatDialog,
    private renderer: Renderer2,
    private widgetEditorService: WidgetEditorService,
  ) {}

  // 预览配置代码
  onPreviewConfigCode() {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.widgetTypeService().getJsonConfig.bind(this.widgetTypeService()),
        minHeight: '80vh',
      },
      minWidth: '1200px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // 配置前置数据
  onFrontData() {}

  // 预览部件
  onPreviewWidget() {
    this.widgetEditorService.previewWidget();
  }

  // 保存部件
  onSaveWidget() {
    this.widgetTypeService().saveWidgetConfig();
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.toggleHeaderMenu(false);
  }

  ngOnDestroy(): void {
    this.toggleHeaderMenu(true);
  }
}
