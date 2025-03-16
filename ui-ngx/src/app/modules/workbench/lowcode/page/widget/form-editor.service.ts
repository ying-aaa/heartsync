import { effect, Injectable, signal } from '@angular/core';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

import {
  deepClone,
  extractProperties,
  generateUUID,
  isBoolean,
  PickConfig,
} from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
  IWidgetType,
} from '@src/app/shared/models/widget.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IFormSubTypes,
  IFormWidgetConfig,
} from '@src/app/shared/models/form-widget.model';
import { FormWidgetService } from '@src/app/core/http/widget.service';
import { FormlyFormOptions } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root',
})
export class FormEditorService {
  HS_DEFAULT_ID = 'workspace';

  widgetConfig = signal<IFormWidgetConfig>({
    id: 1,
    type: IWidgetType.FORM,
    subType: IFormSubTypes.FLAT,
    formName: '',
    isUseFlow: false,
    workspaceName: '',
    flatTypeField: [],
  });

  // 是否编辑模式
  isEditMode = signal(false);

  isShowConfigPanel = signal(false);

  mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  // 当前是否在拖拽中
  dragStart = false;

  // 选中的 Field
  public activeField = signal<IEditorFormlyField | null>(null);
  _fieldSelected$ = new Subject<IEditorFormlyField | null>();
  get fieldSelected$(): Observable<IEditorFormlyField | null> {
    return this._fieldSelected$.asObservable();
  }

  flatField$ = new BehaviorSubject([]);

  fieldsId = signal<number | undefined>(undefined);
  fields = signal<IEditorFormlyField[]>([]);
  formGroup = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {
    formState: {
      fieldsId: 'workspace', // 自定义参数
    },
  };

  constructor(
    private formWidgetService: FormWidgetService,
    private _snackBar: MatSnackBar,
  ) {
    effect(
      () => {
        if (this.fieldsId()) {
          this.formWidgetService.getFormWidgetById(this.fieldsId()!).subscribe({
            next: (widget: IFormWidgetConfig) => {
              this.widgetConfig.set(widget);
              const fieldConfig = widget.flatTypeField as IEditorFormlyField[];
              if (
                widget.type === IWidgetType.FORM &&
                widget.subType === IFormSubTypes.FLAT
              ) {
                this.fields.set(fieldConfig);
              }
              this.isShowConfigPanel.set(false);
              this.selectField(null);

              this.formGroup = new FormGroup({});
              this.options.build && this.options.build();
            },
            error: (err: any) => console.error('Get widget error:', err),
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  getSpecifyFields(fieldId: string) {
    return this.getFlatField(this.fields()).find(
      (item: any) => item.fieldId === fieldId,
    );
  }

  isActiveField(fieldId: string) {
    return this.activeField()?.fieldId === fieldId;
  }

  updateFields() {
    this.formWidgetService
      .updateFormWidget({
        ...this.widgetConfig(),
        flatTypeField: this.fields(),
      })
      .subscribe({
        next: () => {
          this._snackBar.open('更新部件成功!!!', '确定', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          });
        },
        error: (err: any) => console.error('Update widget error:', err),
      });
    this.formGroup.patchValue(this.model);
    this.flatField$.next(this.getFlatField());
  }

  selectField(field: IEditorFormlyField | null): void {
    this.activeField.set(field);
    field && this.isShowConfigPanel.set(true);
    this._fieldSelected$.next(field);
  }

  checkEditModeState(is?: boolean): void {
    if (isBoolean(is)) return this.isEditMode.set(is);
    this.isEditMode.set(!this.isEditMode());
  }

  addField(
    field: IEditorFormlyField,
    toParentField: IEditorFormlyField[],
    toIndex: number,
    selected = true,
  ) {
    field = deepClone(field);
    function addFieldId(field: IEditorFormlyField) {
      field.key = generateUUID();
      field.fieldId = `${field.type}_key_${field.key}`;
      if (field.fieldGroup) {
        field.fieldGroup.forEach(addFieldId);
      }
    }
    addFieldId(field);
    // 子表的默认列数
    if (toParentField[0]?.parent?.type === IFieldType.SUBTABLE) {
      if (field.props) {
        field.props['row'] = 1;
      }
    }
    toParentField.splice(toIndex, 0, field);
    this.formGroup = new FormGroup({});
    this.options.build && this.options.build();
    selected && this.selectField(field);
    this.flatField$.next(this.getFlatField());
  }

  removeField(
    toParentField: IEditorFormlyField[],
    toIndex: number,
    clearSelected = true,
  ) {
    toParentField.splice(toIndex, 1);
    this.formGroup = new FormGroup({});
    this.options.build && this.options.build();
    clearSelected && this.selectField(null);
    this.flatField$.next(this.getFlatField());
  }

  moveField(
    toParent: IEditorFormlyField[],
    fromIndex: number,
    toIndex: number,
  ) {
    moveItemInArray(toParent, fromIndex, toIndex);
    this.formGroup = new FormGroup({});
    this.options.build && this.options.build();
    this.flatField$.next(this.getFlatField());
  }

  transferField(
    formParent: IEditorFormlyField[],
    toParent: IEditorFormlyField[],
    formIndex: number,
    toIndex: number,
  ) {
    // 子表的默认列数
    if (toParent[0]?.parent?.type === IFieldType.SUBTABLE) {
      if (formParent[formIndex].props) {
        formParent[formIndex].props['row'] = 1;
      }
    }
    transferArrayItem(formParent, toParent, formIndex, toIndex);
    this.formGroup = new FormGroup({});
    this.options.build && this.options.build();
    this.flatField$.next(this.getFlatField());
  }

  getConnectedTo(type: IFieldType) {
    const options: any = {
      [IFieldType.FIELDSET]: [],
      [IFieldType.COLUMN]: [this.HS_DEFAULT_ID],
      [IFieldType.FLEX]: [],
      [IFieldType.ROW]: [],
      [IFieldType.MATTABS]: [],
      [IFieldType.SUBTABLE]: [],
    };

    // @ts-ignore
    return this.isEditMode()
      ? findSameField(this.fields(), options)[type]
      : options;
  }

  getJsonField() {
    // 提取配置
    const pickConfig: PickConfig = {
      // key: true,
      type: true,
      fieldId: true,
      props: true,
      className: true,
      fieldGroup: true,
      fieldArray: true,
    };

    return JSON.stringify(
      extractProperties<IEditorFormlyField[]>(
        this.fields(),
        pickConfig,
        'fieldGroup',
      ),
      null,
      2,
    );
  }

  getFlatField(field?: IEditorFormlyField[], level: number = 0) {
    field = field || this.fields();
    return field.reduce((acc, field) => {
      acc.push({
        // @ts-ignore
        name: field.type + '_' + field.key,
        level,
        expandable: !!field.fieldGroup,
        field,
      });
      if (field.fieldGroup) {
        acc.push(...this.getFlatField(field.fieldGroup, level + 1));
      }
      return acc;
    }, [] as any);
  }
}

function findSameField(
  fields: IEditorFormlyField[],
  options: { [key in IFieldType]?: string[] },
): { [key in IFieldType]: string[] } {
  for (let i = 0; i < fields.length; i++) {
    const type = fields[i].type as IFieldType;
    if (
      (type === 'column' || type === 'flex' || type === 'subtable') &&
      options[type]
    ) {
      // 暂时都用column进行连接，后面可改为 new Map 来存储 ！
      options['column']!.unshift(fields[i].fieldId as string);
    } else if (type && options[type]) {
      options[type].unshift(fields[i].fieldId as string);
    }

    if (fields[i].fieldGroup) {
      options = findSameField(
        fields[i].fieldGroup as IEditorFormlyField[],
        options,
      );
    }
  }
  // @ts-ignore
  return options;
}
