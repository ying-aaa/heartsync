import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
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
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule
  ],
})
export class WidgetEditorComponent implements OnInit {
  form = new FormGroup({});
  model = { email: 'email@gmail.com', email1: "" };
  fields: FormlyFieldConfig[] = [
    {
      key: 'col21',
      wrappers: ['col'], // 使用 col 包装器
      props: {
        attributes: {
          class: "cdk-col"
        }
      },
      fieldGroup: [
        {
          key: 'group',
          wrappers: ['group'], // 使用 group 包装器
          props: {
            label: '身份信息',
            attributes: {
              class: "cdk-group-list1"
            }
          },
          fieldGroup: [
            {
              key: 'col1',
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                { key: 'input1', type: 'input', templateOptions: { label: 'Input 1' } },
                { key: 'input2', type: 'input', templateOptions: { label: 'Input 2' } }
              ],
              props: {
                attributes: {
                  class: "cdk-col-list"
                }
              }
            },
            {
              key: 'col2',
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                { key: 'input3', type: 'input', templateOptions: { label: 'Input 3' } },
                { key: 'input4', type: 'input', templateOptions: { label: 'Input 4' } }
              ],
              props: {
                attributes: {
                  class: "cdk-col-list1"
                }
              }
            },
            {
              key: 'col3',
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                { key: 'input5', type: 'input', templateOptions: { label: 'Input 5' } },
                { key: 'input6', type: 'input', templateOptions: { label: 'Input 6' } }
              ],
              props: {
                attributes: {
                  class: "cdk-col-list2"
                }
              }
            }
          ]
        },
        {
          key: 'group2',
          wrappers: ['group'], // 使用 group 包装器
          props: {
            label: '身份信息',
            attributes: {
              class: "cdk-group-list2"
            }
          },
          fieldGroup: [
            {
              key: 'col11',
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                { key: 'input11', type: 'input', templateOptions: { label: 'Input 1' } },
                { key: 'input21', type: 'input', templateOptions: { label: 'Input 2' } }
              ],
              props: {
                attributes: {
                  class: "cdk-col-list3"
                }
              }
            },
            {
              key: 'col21',
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                { key: 'input3', type: 'input', templateOptions: { label: 'Input 3' } },
                { key: 'input4', type: 'input', templateOptions: { label: 'Input 4' } }
              ],
              props: {
                attributes: {
                  class: "cdk-col-list4"
                }
              }
            },
            {
              key: 'col31',
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                { key: 'input51', type: 'input', templateOptions: { label: 'Input 5' } },
                { key: 'input61', type: 'input', templateOptions: { label: 'Input 6' } }
              ],
              props: {
                attributes: {
                  class: "cdk-col-list5"
                }
              }
            }
          ]
        }
      ]

    }

  ];

  onSubmit(model: any) {
    console.log(model, this.form);
  }

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
