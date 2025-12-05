import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { MatIconModule } from '@angular/material/icon';
import { presetResource } from './preset-resource';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { MatRippleModule } from '@angular/material/core';
import { HsThemeService } from '@src/app/core/services/theme.service';
import {
  CdkDrag,
  CdkDropList,
  CdkDragStart,
  CdkDragPlaceholder,
  CdkDragEnd,
} from '@angular/cdk/drag-drop';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { FormEditorService } from '../../../../core/services/form-editor.service';
import { MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule,
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

  presetResource = signal<IEditorFormlyField[]>(presetResource);

  activePresetResource: any = [];

  constructor(
    private hsThemeService: HsThemeService,
    public formEditorService: FormEditorService,
  ) {
    effect(() => {
      this.activePresetResource = this.presetResource().find(
        (item: IEditorFormlyField) => item.key === this.activeValue(),
      );
    });
  }

  getConnectedTo(group: any) {
    const connectedTo = this.formEditorService.getConnectedTo(IFieldType.COLUMN);
    return group._form
      ? connectedTo
      : connectedTo.filter((id: string) => !id.startsWith(IFieldType.SUBTABLE));
  }

  matRippleColor = () => this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  getDragFieldData = (field: IEditorFormlyField) => ({
    action: ICdkDrapActionType.COPY,
    field,
  });

  onDragStart(preset: any, group: any, event: CdkDragStart<any>) {
    const configIndex = this.presetResource().findIndex(
      (item: IEditorFormlyField) => item.key === this.activeValue(),
    );
    const groupIndex = this.presetResource()[configIndex].fieldGroup!.findIndex(
      (item: IEditorFormlyField) => item.props?.label === group.props?.label,
    );
    const groupChildIndex = this.presetResource()[configIndex].fieldGroup![
      groupIndex
    ].fieldGroup!.findIndex(
      (item: IEditorFormlyField) => item.props?.label === preset.props?.label,
    );

    // 创建一个临时占位元素
    const placeholder = { ...preset, isPlaceholder: true };

    this.presetResource.update((value: any) => {
      const newValue = [...value];
      newValue[configIndex].fieldGroup[groupIndex].fieldGroup.splice(
        groupChildIndex,
        0,
        placeholder,
      );
      return newValue;
    });
  }

  onDragEnd(event: CdkDragEnd<any>) {
    const configIndex = this.presetResource().findIndex((item) => item.key === this.activeValue());

    this.presetResource.update((value: any) => {
      const newValue = [...value];

      newValue[configIndex].fieldGroup.forEach((group: any) => {
        group.fieldGroup = group.fieldGroup.filter((item: any) => !item.isPlaceholder);
      });

      return newValue;
    });
  }

  ngOnInit() {}
}
