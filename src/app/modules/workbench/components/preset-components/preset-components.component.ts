import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { MatIconModule } from '@angular/material/icon';
import { presetResource } from './preset-resource';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { MatRippleModule } from '@angular/material/core';
import { HsThemeService } from '@src/app/core/services/theme.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragStart,
  CdkDragPlaceholder,
  CdkDragEnd,
} from '@angular/cdk/drag-drop';
import { WidgetEditorService } from '../../lowcode/page/widget/widget-editor.service';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { generateUUID } from '@src/app/core/utils';
@Component({
  selector: 'hs-preset-components',
  templateUrl: './preset-components.component.html',
  styleUrls: ['./preset-components.component.less'],
  imports: [
    HsRadioComponent,
    MatIconModule,
    MatRippleModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
  ],
})
export class PresetComponentsComponent implements OnInit {
  IFieldType = IFieldType;
  activeValue = signal<string>('layout');

  configTypes: IRadioConfig[] = [
    { label: '布局', value: 'layout' },
    { label: '输入', value: 'input' },
    { label: '选择', value: 'select' },
    { label: '文件', value: 'upload' },
    { label: '系统', value: 'system' },
    { label: '位置', value: 'location' },
    { label: '子表', value: 'subtable' },
    { label: '展示', value: 'display' },
  ];

  presetResource = signal(presetResource);

  activePresetResource: any = [];

  constructor(
    private hsThemeService: HsThemeService,
    public widgetEditorService: WidgetEditorService,
  ) {
    effect(() => {
      this.activePresetResource = this.presetResource().find(
        (item) => item.value === this.activeValue(),
      )!.group;
    });
  }
  matRippleColor = () =>
    this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  onDragStart(preset: any, group: any, event: CdkDragStart<any>) {
    const configIndex = this.presetResource().findIndex(
      (item) => item.value === this.activeValue(),
    );
    const groupIndex = this.presetResource()[configIndex].group.findIndex(
      (item) => item.name === group.name,
    );
    const groupChildIndex = this.presetResource()[configIndex].group[
      groupIndex
    ].groupChild.findIndex((item) => item.name === preset.name);

    // 创建一个临时占位元素
    const placeholder = { ...preset, isPlaceholder: true };

    this.presetResource.update((value: any) => {
      const newValue = [...value];
      newValue[configIndex].group[groupIndex].groupChild.splice(
        groupChildIndex,
        0,
        placeholder,
      );
      return newValue;
    });
  }

  onDragEnd(event: CdkDragEnd<any>) {
    const configIndex = this.presetResource().findIndex(
      (item) => item.value === this.activeValue(),
    );

    this.presetResource.update((value: any) => {
      const newValue = [...value];

      newValue[configIndex].group.forEach((group: any) => {
        group.groupChild = group.groupChild.filter(
          (item: any) => !item.isPlaceholder,
        );
      });

      return newValue;
    });
  }

  ngOnInit() {}
}
