import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IRadioConfig } from '@src/app/shared/models/public-api';
const toolbarConfigs: IRadioConfig[] = [
  {
    label: '底图',
    value: 'baseMap',
    icon: 'map',
  },
  {
    label: '图层',
    value: 'layer',
    icon: 'layers',
  },
  {
    label: '实体',
    value: 'entities',
    icon: 'draw',
  },
  {
    label: '地形',
    value: 'terrain',
    icon: 'terrain',
  },
  {
    label: '场景',
    value: 'scene',
    icon: 'settings',
  },
  {
    label: '相机',
    value: 'camera',
    icon: 'camera_alt',
  },
  {
    label: '控件',
    value: 'controls',
    icon: 'pest_control',
  },
  {
    label: '模型',
    value: 'model',
    icon: 'location_city',
  },
  {
    label: '特效',
    value: 'effect',
    icon: 'ac_unit',
  },
];
@Component({
  selector: 'hs-cesium-toolbar',
  templateUrl: './cesium-toolbar.component.html',
  imports: [MatButtonModule, MatIconModule, HsRadioComponent],
})
export class CesiumToolbarComponent implements OnInit {
  toolbarConfigs = toolbarConfigs;

  constructor(private router: Router) {}

  ngOnInit() {}

  toWidgetManage() {
    this.router.navigate(['/design/widget/resource']);
  }
}
