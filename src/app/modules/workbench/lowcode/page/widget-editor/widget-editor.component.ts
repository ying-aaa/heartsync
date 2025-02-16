import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsFancytreeComponent } from '@src/app/shared/components/hs-fancytree/hs-fancytree.component';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { PresetComponentsComponent } from '../../../components/preset-components/preset-components.component';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragPlaceholder,
  CdkDragStart,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'hs-widget-editor',
  templateUrl: './widget-editor.component.html',
  styleUrls: ['./widget-editor.component.less'],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    HsFancytreeComponent,
    HsRadioComponent,
    PresetComponentsComponent,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDropListGroup,
  ],
})
export class WidgetEditorComponent implements OnInit {
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

  // 拖拽源数据
  // 拖拽源数据（预设组件中的元素）
  sourceItems = [
    { id: 1, name: '元素A' },
    { id: 2, name: '元素B' },
    { id: 3, name: '元素C' },
  ];

  // 目标容器数据（工作台中的元素）
  targetItems: any[] = [];

  // 临时保存复制的元素
  clonedItem: any;

  // 拖拽开始时触发：复制元素
  onDragStart(event: CdkDragStart) {
    const originalItem = event.source.data;
    this.clonedItem = {
      ...originalItem,
      id: `${originalItem.id}-${Date.now()}`, // 生成唯一ID
    };
  }

  onDragMove(event: CdkDragMove) {
    console.log('%c Line:80 🍿 event', 'color:#e41a6a', event);
  }

  // 放置到目标容器时触发：生成新元素
  onDrop(event: any) {
    console.log('%c Line:85 🌶', 'color:#e41a6a', event);
    if (event.previousContainer !== event.container) {
      this.targetItems.push(this.clonedItem);
    }
  }

  constructor() {
    setTimeout(() => {
      this.is.set(true);
    }, 10000);
  }
  items: any = ['1', '2', '3', '4', '5'];
  enterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    console.log('%c Line:98 🥃 drag', 'color:#42b983', drag.data);
    console.log('%c Line:98 🍷 drag', 'color:#e41a6a', drag.dropContainer);

    console.log('%c Line:98 🥑 drop', 'color:#4fff4B', drop);
    // 如果拖拽项属于当前子列表，则允许在子列表内拖拽
    return drag.data % 2 === 0;
  };

  is = signal(false);

  noReturnPredicate(a: any, b: any) {
    console.log('%c Line:107 🍧 a', 'color:#ed9ec7', a);
    console.log('%c Line:107 🍖 b', 'color:#ea7e5c', b);
    return false;
  }
  ngOnInit() {}
}
