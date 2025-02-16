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
} from '@angular/cdk/drag-drop';
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
  ],
})
export class PresetComponentsComponent implements OnInit {
  onDragStart($event: CdkDragStart<any>) {
    console.log('%c Line:31 🍉 $event', 'color:#3f7cff', $event);
  }
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

  constructor(private hsThemeService: HsThemeService) {
    effect(() => {
      this.activePresetResource = this.presetResource().find(
        (item) => item.value === this.activeValue(),
      )!.group;
    });
  }

  isEnterPredicate = () => false;

  matRippleColor = () =>
    this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  ngOnInit() {}
}
