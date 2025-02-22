import { Component, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HsFancytreeComponent } from '@src/app/shared/components/hs-fancytree/hs-fancytree.component';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IRadioConfig } from '@src/app/shared/models/system.model';
@Component({
  selector: 'hs-widget-folder',
  templateUrl: './widget-folder.component.html',
  styleUrls: ['./widget-folder.component.less'],
  imports: [HsFancytreeComponent, HsRadioComponent],
})
export class WidgetFolderComponent implements OnInit {
  activeValue = signal<string>('form');

  fileName = new FormControl('');

  configTypes: IRadioConfig[] = [
    { label: '代码', value: 'code' },
    { label: '图表', value: 'chart' },
    { label: '地图', value: 'map' },
    { label: 'x6', value: 'x6' },
    { label: '表单', value: 'form' },
    { label: '列表', value: 'list' },
    { label: '详情', value: 'detail' },
  ];
  constructor() {}

  ngOnInit() {}
}
