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
  ],
})
export class WidgetPreviewComponent {
  zoomControl = viewChild.required<WidgetZoomComponent>('ZoomControl');

  constructor(public widgetEditorService: WidgetEditorService) {}

  workSizeConfig = computed(
    () => this.widgetEditorService.currentWidgetConfig().workSizeConfig,
  );
}
