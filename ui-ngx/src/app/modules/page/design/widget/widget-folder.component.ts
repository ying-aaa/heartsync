import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, computed, effect, input, OnInit, signal, viewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import {
  WidgetEditorService,
  widgetTypeIcons,
  widgetTypesList,
} from '@app/core/services/widget-editor.service';
import { deepClone, generateUUID, getParamFromRoute } from '@src/app/core/utils';
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

  dashboardDesign = input<boolean>(false);

  appId: string | null = getParamFromRoute('appId', this.route);
  businessKey = computed(() => this.widgetEditorService.widgetType());

  widgetId = signal<string | null>(null);
  widgetType = this.widgetEditorService.widgetType;

  widgetTypesList = widgetTypesList;

  widgetTypeIcons = widgetTypeIcons;

  searchValue = new FormControl('');
  pageLink = new PageLink(
    0,
    100,
    [
      { prop: 'name', defaultValue: this.searchValue.value },
      { prop: 'appId', defaultValue: this.appId },
      { prop: 'type', defaultValue: this.widgetType() },
    ],
    [],
  );
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
        this.pageLink.changeSearch('type', widgetType);
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
        switchMap(() =>
          this.widgetService.findAllWidget(this.pageLink).pipe(
            catchError((err) => {
              this.isLoading.set(false);
              return [{ data: [] }];
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        this.widgetList.set(res.data);
        if (!this.widgetId() && res.data.length && !this.dashboardDesign()) {
          const widgetId = res.data[0]?.id;
          this.updateWidgetId(widgetId);
        }
      });
  }

  private handleSearchInput(): void {
    this.searchValue.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.pageLink.changeSearch('name', value);
        this.triggerRequest();
      });
  }

  triggerRequest(): void {
    this.requestTrigger$.next();
  }

  onQueryData(): void {
    this.requestTrigger$.next();
  }

  onResetData(): void {
    this.searchValue.setValue('');
  }

  updateWidgetId(widgetId: string | null, event?: Event) {
    event && event.preventDefault();
    if (widgetId === this.widgetId()) return;
    this.widgetId.set(widgetId);
    this.widgetEditorService.setWidgetId(widgetId, true);
  }

  operateTargetEditor(widget: any) {
    this.editingWidget.set(widget);
    const targetEditor = this.inlineEditorRefs().find((editor) => editor.editorId === widget.id);
    targetEditor?.editTriggerEvent();
  }

  addTempWidget() {
    // 先建一个临时部件给用户命名
    const tempWidget = {
      id: generateUUID(),
      name: '新部件',
      type: this.widgetType(),
      appId: this.appId!,
      isCreate: true,
    };
    this.widgetList.update((widgets) => [...widgets, tempWidget]);
    setTimeout(() => {
      this.operateTargetEditor(tempWidget);
    }, 300);
  }

  editConfirmWidget(widget: any, newName: string) {
    if (widget.isCreate) {
      widget.name = newName;
      this.addWidget(widget);
    } else {
      this.renameWidget(widget.name, newName);
    }
  }

  addWidget(widget: any) {
    widget = deepClone<any>(widget);
    Reflect.deleteProperty(widget, 'isCreate');
    const widgetId = widget.id;
    Reflect.deleteProperty(widget, 'id');
    this.widgetService.createWidget(widget).subscribe({
      next: (res) => {
        this.widgetList.update((widgets) =>
          widgets.map((widget: any) => (widget.id === widgetId ? res : widget)),
        );
        this.updateWidgetId(res.id);
        this.cancelEditWidget();
        this.toastrService.success('创建成功');
      },
    });
  }

  renameWidget(oldName: string, newName: string) {
    if (oldName === newName) return this.cancelEditWidget();
    const widgetId = this.editingWidget()?.id;
    this.widgetService
      .updateWidget(widgetId, { name: newName }, { type: this.widgetType() })
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
    this.widgetService.removeWidget(widgetId, this.widgetType()).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.widgetList.update((widgets) =>
            widgets.filter((widget: any) => widget.id !== widgetId),
          );
          this.updateWidgetId(null);
          this.toastrService.success('删除成功');
        }
      },
    });
  }

  cancelEditWidget(widget: any = null) {
    if (widget && widget.isCreate) {
      this.widgetList.update((widgets) => widgets.filter((item: any) => item.id !== widget.id));
    }
    this.editingWidget.set(null);
  }

  ngOnInit() {
    this.initLoadData();
    this.handleSearchInput();
    this.triggerRequest();
    // (document.querySelector('hs-workbench-header')! as HTMLElement).style.display = 'none';
  }
}
