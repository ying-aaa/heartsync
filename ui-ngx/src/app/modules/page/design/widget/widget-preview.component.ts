import { Component, computed, viewChild } from '@angular/core';
import { WidgetZoomComponent } from './widget-zoom.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { IEditSizeConfig } from '@src/app/shared/models/public-api';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { CommonModule } from '@angular/common';
import { WidgetContainerComponent } from './widget-container.component';
import { Router } from '@angular/router';
@Component({
  selector: 'hs-widget-preview',
  templateUrl: './widget-preview.component.html',
  styleUrls: ['./widget-preview.component.less'],
  imports: [
    CdkDrag,
    WidgetZoomComponent,
    MatButtonModule,
    MatIconModule,
    NgScrollbarModule,
    ConcatUnitsPipe,
    CommonModule,
    WidgetContainerComponent,
  ],
})
export class WidgetPreviewComponent {
  zoomControl = viewChild.required<WidgetZoomComponent>('ZoomControl');

  constructor(
    private widgetEditorService: WidgetEditorService,
    private router: Router,
  ) {}

  workSizeConfig = computed(
    () => this.widgetEditorService.currentWidgetConfig().workSizeConfig,
  );

  toWidgetDesign() {
    this.router.navigate(['/design/widget/form'], {
      queryParams: { widgetId: this.widgetEditorService.currentWidgetId() },
    });
  }

  // 边距处理
  getWdigetSize() {
    const size = this.workSizeConfig()?.size || {
      width: 100,
      height: 100,
      widthUnits: '%',
    };
    let { width, height, widthUnits } = size;
    if (widthUnits === 'px') {
      width = width - 40;
      height = height - 40;
    }
    return { ...size, width, height };
  }
}
