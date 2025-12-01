import { Component, computed, viewChild } from '@angular/core';
import { WidgetZoomComponent } from './widget-zoom.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { CommonModule } from '@angular/common';
import { WidgetContainerComponent } from '@src/app/modules/components/widget-container/widget-container.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'hs-widget-viewport',
  templateUrl: './widget-viewport.component.html',
  styleUrls: ['./widget-viewport.component.less'],
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
export class WidgetViewportComponent {
  zoomControl = viewChild.required<WidgetZoomComponent>('ZoomControl');

  widgetId = computed(() => this.widgetEditorService.currentWidgetId());

  widgetType = computed(() => this.widgetEditorService.currentWidgetType());

  constructor(
    private widgetEditorService: WidgetEditorService,
    private router: Router,
  ) {}

  workSizeConfig = computed(() => {
    const workSizeConfig = this.widgetEditorService.currentWidgetConfig().workSizeConfig || {
      width: 100,
      height: 100,
      widthUnits: '%',
    };
    let { width, height, widthUnits } = workSizeConfig;
    if (widthUnits === 'px') {
      width = width - 40;
      height = height - 40;
    }
    return { ...workSizeConfig, width, height };
  });

  toWidgetDesign() {
    const widgetId = this.widgetEditorService.currentWidgetId();
    const widgetType = this.widgetEditorService.currentWidgetType();
    const currentUrl = this.router.url;

    this.router.navigate([`${currentUrl}/${widgetType}`], {
      queryParams: { widgetId },
    });
  }
}
