import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsFancytreeComponent } from '@src/app/shared/components/hs-fancytree/hs-fancytree.component';
import { PresetComponentsComponent } from '../../../components/preset-components/preset-components.component';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IRadioConfig } from '@src/app/shared/models/system.model';

@Component({
  selector: 'hs-widget-editor',
  templateUrl: './widget-editor.component.html',
  styleUrls: ['./widget-editor.component.css'],
  imports: [
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    HsFancytreeComponent,
    HsRadioComponent,
  ],
})
export class WidgetEditorComponent implements OnInit {
  activeValue = signal<string>('form');

  selectedTypeValue = new FormControl('form'); // 初始化默认值
  fileName = new FormControl('');

  configTypes: IRadioConfig[] = [
    { label: '自定义', value: 'custom' },
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
