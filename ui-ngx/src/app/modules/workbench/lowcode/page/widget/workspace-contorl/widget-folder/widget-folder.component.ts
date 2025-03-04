import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Widget, WidgetService } from '@src/app/core/http/widget.service';
import { HsFancytreeComponent } from '@src/app/shared/components/hs-fancytree/hs-fancytree.component';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IFancyTreeConfig } from '@src/app/shared/models/public-api';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { WidgetEditorService } from '../../widget-editor.service';
import { generateUUID } from '@src/app/core/utils';
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
    loadTreeData: () => {
      return this.widgetService.getAllWidgets().toPromise();
    },
    addNodeEvent: (data) => {
      this.widgetService
        .createWidget({
          title: data.node.title,
          key: generateUUID(),
          type: this.activeValue(),
          config: '[]', // 部件配置项
        })
        .subscribe({
          next: (res) => {
            this._snackBar.open('新增部件成功!!!', '确定', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3 * 1000,
            });
            data.node.data.id = res.id;
            data.node.data.key = res.key;
          },
        });
    },
    deleteNodeEvent: (id: number) => {
      this.widgetService.deleteWidget(id).subscribe({
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
      this.widgetEditorService.fieldsId.set(selectedNode.data.id);
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
    private widgetService: WidgetService,
    private widgetEditorService: WidgetEditorService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {}
}
