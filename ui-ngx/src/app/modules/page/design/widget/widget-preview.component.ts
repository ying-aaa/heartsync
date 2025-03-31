import { Component, computed, viewChild } from '@angular/core';
import { WidgetZoomComponent } from './widget-zoom.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { CommonModule } from '@angular/common';
import { WidgetContainerComponent } from './widget-container.component';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
  ) {}

  workSizeConfig = computed(
    () => this.widgetEditorService.currentWidgetConfig().workSizeConfig,
  );

  toWidgetDesign() {
    const widgetType = this.widgetEditorService.currentWidgetType();
    this.router.navigate([`/design/widget/${widgetType}`], {
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
