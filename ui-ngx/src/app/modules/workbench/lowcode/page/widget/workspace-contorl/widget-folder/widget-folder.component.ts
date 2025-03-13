import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormWidgetService } from '@src/app/core/http/widget.service';
import { HsFancytreeComponent } from '@src/app/shared/components/hs-fancytree/hs-fancytree.component';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import {
  IFancyTreeConfig,
  IWidgetType,
} from '@src/app/shared/models/public-api';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { FormEditorService } from '../../form-editor.service';
import { IFormSubTypes } from '@src/app/shared/models/form-widget.model';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'hs-widget-folder',
  templateUrl: './widget-folder.component.html',
  styleUrls: ['./widget-folder.component.less'],
  imports: [HsFancytreeComponent, HsRadioComponent, ClipboardModule],
})
export class WidgetFolderComponent implements OnInit {
  fileName = new FormControl('');

  activeValue = signal<string>('form');

  treeConfig = signal<IFancyTreeConfig>({
    isDefaultFirst: true,
    loadTreeData: () => {
      return this.fornWidgetService.getAllFormWidgets().toPromise();
    },
    renderTitle: (event, data) => {
      return `<span class="fancytree-title">${data?.node?.data?.workspaceName}</span>`;
    },
    addNodeEvent: (data) => {
      this.fornWidgetService
        .createFormWidget({
          formName: data.node.title,
          type: IWidgetType.FORM,
          subType: IFormSubTypes.FLAT,
          workspaceName: data.node.title,
        })
        .subscribe({
          next: (res) => {
            this._snackBar.open('新增部件成功!!!', '确定', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3 * 1000,
            });
            data.node.data.id = res.id;
            data.node.data.key = res.id;
          },
        });
    },
    deleteNodeEvent: (id: number) => {
      this.fornWidgetService.deleteFormWidget(id).subscribe({
        next: () => {
          this._snackBar.open('删除部件成功!!!', '确定', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          });
        },
      });
    },
    selectNodeEvent: (data: any) => {
      const selectedNode = data.node;
      // const selectedNodes = data.tree.getSelectedNodes();
      this.formEditorService.fieldsId.set(selectedNode.data.id);
    },
  });

  configTypes: IRadioConfig[] = [
    { label: '代码', value: 'code' },
    { label: '图表', value: 'chart' },
    { label: '地图', value: 'map' },
    { label: 'x6', value: 'x6' },
    { label: '表单', value: 'form' },
    { label: '列表', value: 'list' },
    { label: '详情', value: 'detail' },
  ];

  constructor(
    private fornWidgetService: FormWidgetService,
    private formEditorService: FormEditorService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {}
}
