import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormWidgetService } from '@src/app/core/http/widget.service';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import {
  IFancyTreeConfig,
  IWidgetType,
} from '@src/app/shared/models/public-api';
import { IFormSubTypes } from '@src/app/shared/models/form-widget.model';
import {
  WidgetEditorService,
  widgetTypesList,
} from '@app/core/services/widget-editor.service';
import { FormEditorService } from '@app/core/services/form-editor.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { HsTreeComponent } from '@shared/components/hs-tree/hs-tree.component';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';

@Component({
  selector: 'hs-widget-folder',
  templateUrl: './widget-folder.component.html',
  imports: [HsRadioComponent, ClipboardModule, HsTreeComponent],
})
export class WidgetFolderComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);
  businessKey = computed(() => this.widgetEditorService.currentWidgetType());

  widgetId: string;
  // treeConfig = signal<IFancyTreeConfig>({
  //   isDefaultFirst: true,
  //   loadTreeData: () => {
  //     return this.formWidgetService.getAllFormWidgets().toPromise();
  //   },
  //   renderTitle: (event, data) => {
  //     return `<span class="fancytree-title">${data?.node?.data?.workspaceName}</span>`;
  //   },
  //   addNodeEvent: (data) => {
  //     this.formWidgetService
  //       .createFormWidget({
  //         formName: data.node.title,
  //         type: IWidgetType.FORM,
  //         subType: IFormSubTypes.FLAT,
  //         workspaceName: data.node.title,
  //       })
  //       .subscribe({
  //         next: (res) => {
  //           this._snackBar.open('新增部件成功!!!', '确定', {
  //             horizontalPosition: 'center',
  //             verticalPosition: 'top',
  //             duration: 3 * 1000,
  //           });
  //           data.node.data.id = res.id;
  //           data.node.data.key = res.id;
  //         },
  //       });
  //   },
  //   deleteNodeEvent: (id: number) => {
  //     this.formWidgetService.deleteFormWidget(id).subscribe({
  //       next: () => {
  //         this._snackBar.open('删除部件成功!!!', '确定', {
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top',
  //           duration: 3 * 1000,
  //         });
  //       },
  //     });
  //   },
  //   defaultSelectNodeEvent: (data: any) => {
  //     const selectedNode = data.node;
  //     const { workspaceName: widgetName, id } = selectedNode.data;
  //     this.widgetEditorService.setWidgetId(id);
  //   },
  // });

  treeConfig = signal<IFileTreeConfig>({
    featureList: [
      'createFile',
      'createFolder',
      'rename',
      'remove',
      'copy',
      'cut',
      'paste',
      'dnd',
      'blank',
      'search',
    ],
    deleteEvent: async (node, jsTree) => {
      return true;
    },
    selectEvent: (node, jsTree) => {
      if (node) {
        this.widgetId = node.id;
      }
    },
  });

  widgetTypesList = widgetTypesList;

  constructor(
    private formWidgetService: FormWidgetService,
    private formEditorService: FormEditorService,
    public widgetEditorService: WidgetEditorService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {}
}
