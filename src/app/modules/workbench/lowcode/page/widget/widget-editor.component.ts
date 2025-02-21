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
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { WidgetEditorService } from './widget-editor.service';
import { WorkspaceToobarComponent } from './workspace-viewport/workspace-toobar/workspace-toobar.component';
import { WorkspaceContentComponent } from './workspace-viewport/workspace-content/workspace-content.component';
import { WorkspaceViewportComponent } from './workspace-viewport/workspace-viewport.component';
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
    FormlyModule,
    WorkspaceViewportComponent,
  ],
})
export class WidgetEditorComponent implements OnInit {
  form = new FormGroup({});
  model = { email: 'email@gmail.com', email1: '' };

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

  constructor(public widgetEditorService: WidgetEditorService) {}

  ngOnInit() {}
}
