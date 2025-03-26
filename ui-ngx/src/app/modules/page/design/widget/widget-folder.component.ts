import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormWidgetService } from '@src/app/core/http/widget.service';
import { HsFancytreeComponent } from '@src/app/shared/components/hs-fancytree/hs-fancytree.component';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import {
  IFancyTreeConfig,
  IWidgetType,
} from '@src/app/shared/models/public-api';
import { IFormSubTypes } from '@src/app/shared/models/form-widget.model';
import {
  WidgetEditorService,
  widgetTypesList,
} from '../../../../core/services/widget-editor.service';
import { FormEditorService } from '../../../../core/services/form-editor.service';

@Component({
  selector: 'hs-widget-folder',
  templateUrl: './widget-folder.component.html',
  styleUrls: ['./widget-folder.component.less'],
  imports: [HsFancytreeComponent, HsRadioComponent, ClipboardModule],
})
export class WidgetFolderComponent implements OnInit {
  treeConfig = signal<IFancyTreeConfig>({
    isDefaultFirst: true,
    loadTreeData: () => {
      return this.formWidgetService.getAllFormWidgets().toPromise();
    },
    renderTitle: (event, data) => {
      return `<span class="fancytree-title">${data?.node?.data?.workspaceName}</span>`;
    },
    addNodeEvent: (data) => {
      this.formWidgetService
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
      this.formWidgetService.deleteFormWidget(id).subscribe({
        next: () => {
          this._snackBar.open('删除部件成功!!!', '确定', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          });
        },
      });
    },
    defaultSelectNodeEvent: (data: any) => {
      const selectedNode = data.node;
      const { workspaceName: widgetName, id } = selectedNode.data;
      this.widgetEditorService.activeWidget.set({
        widgetName,
        id,
      });
      this.formEditorService.fieldsId.set(id);
    },
  });

  widgetTypesList = widgetTypesList;

  constructor(
    private formWidgetService: FormWidgetService,
    private formEditorService: FormEditorService,
    public widgetEditorService: WidgetEditorService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {}
}
