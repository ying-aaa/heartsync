import { Component, OnInit } from '@angular/core';
import { CesiumToolbarComponent } from './cesium-toolbar/cesium-toolbar.component';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetCesiumComponent } from '@src/app/modules/components/widget-cesium/widget-cesium.component';

@Component({
  selector: 'hs-cesium-design',
  templateUrl: './cesium-design.component.html',
  styleUrls: ['./cesium-design.component.css'],
  imports: [CesiumToolbarComponent, MatDividerModule, WidgetCesiumComponent],
})
export class CesiumDesignComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
