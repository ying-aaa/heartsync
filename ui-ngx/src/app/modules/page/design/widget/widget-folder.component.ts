import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, computed, effect, OnInit, signal, viewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import {
  WidgetEditorService,
  widgetTypeIcons,
  widgetTypesList,
} from '@app/core/services/widget-editor.service';
import { generateUUID, getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { WidgetService } from '@src/app/core/http/widget.service';
import {
  catchError,
  debounceTime,
  finalize,
  firstValueFrom,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
  throwError,
} from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { HsInlineEditorModule } from '@src/app/shared/components/hs-inline-editor/inline-editor.module';
import { HsInlineEditorComponent } from '@src/app/shared/components/hs-inline-editor/inline-editor.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hs-widget-folder',
  templateUrl: './widget-folder.component.html',
  imports: [
    HsRadioComponent,
    ClipboardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HsDynamicTableModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    NgScrollbarModule,
    HsLoadingModule,
    HsSvgModule,
    MatMenuModule,
    CommonModule,
    HsInlineEditorModule,
  ],
})
export class WidgetFolderComponent implements OnInit {
  inlineEditorRefs = viewChildren<HsInlineEditorComponent>('InlineEditorRef');

  appId: string | null = getParamFromRoute('appId', this.route);
  businessKey = computed(() => this.widgetEditorService.widgetType());

  widgetId = signal<string | null>(null);
  widgetType = this.widgetEditorService.widgetType;

  treeConfig = signal<IFileTreeConfig>({
    noDataText: '没有找到相关部件！',
    noDataCreate: true,
    noDataCreateText: '创建部件',
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
        if (id === this.widgetId) this.updateWidgetId(null);
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

  widgetTypeIcons = widgetTypeIcons;

  searchValue = new FormControl('');
  pageLink = new PageLink(0, 20, [{ prop: 'search' }], []);
  widgetList = signal<any>([]);
  isLoading = signal<boolean>(false);

  editingWidget = signal<any>(null);

  menuActions = [
    {
      icon: 'edit',
      name: '重命名部件',
      action: (widget: any) => {
        this.operateTargetEditor(widget);
      },
    },
    {
      icon: 'delete',
      name: '删除部件',
      action: (widget: any) => this.removeWidget(widget.id),
      confirm: true,
      confirmName: '确认删除',
    },
  ];

  private requestTrigger$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private widgetService: WidgetService,
    public widgetEditorService: WidgetEditorService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {
    effect(() => {
      const widgetType = this.widgetType();
      this.widgetList.set([]);
      if (widgetType) {
        this.widgetId.set(null);
        this.requestTrigger$.next();
      }
    });
  }

  private initLoadData(): void {
    this.requestTrigger$
      .pipe(
        tap((_) => this.isLoading.set(true)),
        throttleTime(500, undefined, { leading: true, trailing: false }),
        switchMap(() => this.widgetService.findWidgetByType(this.widgetType())),
        map((data) => ({ data })),
        takeUntil(this.destroy$),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        this.widgetList.set(res.data);
        if (!this.widgetId() && res.data.length) {
          const widgetId = res.data[0]?.id;
          this.updateWidgetId(widgetId);
        }
      });
  }

  private handleSearchInput(): void {
    this.searchValue.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.pageLink.changeSearch('search', value);
        this.triggerRequest();
      });
  }

  triggerRequest(): void {
    this.requestTrigger$.next();
  }

  onQueryData(): void {
    this.pageLink.getData();
  }

  onResetData(): void {
    this.searchValue.setValue('');
  }

  updateWidgetId(widgetId: string | null) {
    this.widgetId.set(widgetId);
    this.widgetEditorService.setWidgetId(widgetId);
  }

  operateTargetEditor(widget: any) {
    this.editingWidget.set(widget);
    const targetEditor = this.inlineEditorRefs().find((editor) => editor.editorId === widget.id);
    targetEditor?.editTriggerEvent();
  }

  addWidget() {
    // 先建一个临时部件给用户命名
    const tempWidget = {
      id: generateUUID(),
      name: '新部件',
      type: this.widgetType(),
      appId: this.appId!,
      isCreate: true,
    };
    this.widgetList.update((widgets) => [...widgets, tempWidget]);
    this.widgetId.set(tempWidget.id);
    setTimeout(() => {
      this.menuActions[0].action(tempWidget);
    }, 300);
  }

  renameWidget(name: string) {
    const widgetId = this.editingWidget()?.id;
    this.widgetService
      .updateWidget(widgetId, { name })
      .pipe(finalize(() => this.cancelEditWidget()))
      .subscribe({
        next: (res) => {
          this.widgetList.update((widgets) =>
            widgets.map((widget: any) => (widget.id === res.id ? res : widget)),
          );
          this.cancelEditWidget();
          this.toastrService.success('重命名成功');
        },
      });
  }

  removeWidget(widgetId: string) {
    this.widgetService.removeWidget(widgetId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.widgetList.update((widgets) =>
            widgets.filter((widget: any) => widget.id !== widgetId),
          );
          this.toastrService.success('删除成功');
        }
      },
    });
  }

  cancelEditWidget() {
    this.editingWidget.set(null);
  }

  ngOnInit() {
    this.initLoadData();
    this.handleSearchInput();
    this.triggerRequest();
  }
}
