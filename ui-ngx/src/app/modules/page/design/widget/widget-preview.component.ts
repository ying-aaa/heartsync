import { Component, viewChild } from '@angular/core';
import { WidgetZoomComponent } from './widget-zoom.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
@Component({
  selector: 'hs-widget-preview',
  templateUrl: './widget-preview.component.html',
  styleUrls: ['./widget-preview.component.less'],
  imports: [CdkDrag, WidgetZoomComponent, MatButtonModule, MatIconModule],
  host: {
    class: 'block wh-full relative',
  },
})
export class WidgetPreviewComponent {
  zoomControl = viewChild.required<WidgetZoomComponent>('ZoomControl');

  constructor() {}
}
