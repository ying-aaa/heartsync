import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormWidgetService } from '@src/app/core/http/form-widget.service';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IFancyTreeConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { IFormSubTypes } from '@src/app/shared/models/form-widget.model';
import { WidgetEditorService, widgetTypesList } from '@app/core/services/widget-editor.service';
import { FormEditorService } from '@app/core/services/form-editor.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { HsTreeComponent } from '@shared/components/hs-tree/hs-tree.component';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { WidgetService } from '@src/app/core/http/widget.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hs-widget-folder',
  templateUrl: './widget-folder.component.html',
  imports: [HsRadioComponent, ClipboardModule, HsTreeComponent, FormsModule],
})
export class WidgetFolderComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);
  businessKey = computed(() => this.widgetEditorService.currentWidgetType());

  widgetId: string;
  // currentWidgetType = signal<IWidgetType>(IWidgetType.FORM);
  widgetType = this.widgetEditorService.currentWidgetType;

  treeConfig = signal<IFileTreeConfig>({
    featureList: [
      'createFile',
      'rename',
      'remove',
      'copy',
      'cut',
      'paste',
      // 'dnd',
      'blank',
      'search',
    ],
    deleteEvent: async (node, jsTree) => {
      const { id } = node;
      let next = false;
      try {
        const res = await firstValueFrom(this.widgetService.removeWidget(id));
        if (res.statusCode === 200) next = true;
      } catch (error) {
        next = false;
      }
      return next;
    },
    selectEvent: (node, jsTree) => {
      const { type, id } = node || {};
      if (type === 'folder') return;
      if (id) {
        this.updateWidgetId(id);
      }
    },
    createNodeSuccess: (node, jsTree) => {
      const { id: nodeId, text: name } = node;
      this.widgetService
        .createWidget({
          nodeId,
          name,
          appId: this.appId!,
          type: this.widgetType(),
        })
        .subscribe({
          next: () => this.updateWidgetId(nodeId),
        });
    },
    renameNodeSuccess: (node, jsTree) => {
      const { id: nodeId, text: name } = node;
      this.widgetService
        .updateWidget(nodeId, {
          name,
        })
        .subscribe({
          next: () => this.updateWidgetId(nodeId),
        });
    },
  });

  widgetTypesList = widgetTypesList;

  constructor(
    private widgetService: WidgetService,
    public widgetEditorService: WidgetEditorService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  updateWidgetId(widgetId: string) {
    this.widgetId = widgetId;
    this.widgetEditorService.setWidgetId(this.widgetId);
  }

  ngOnInit() {}
}
