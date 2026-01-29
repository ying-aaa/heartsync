import { effect, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { deepClone, extractProperties, PickConfig } from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
  IWidgetTypeAbstract,
} from '@src/app/shared/models/widget.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFormSubTypes, IFormWidgetConfig } from '@src/app/shared/models/form-widget.model';
import { FormWidgetService } from '@src/app/core/http/form-widget.service';

@Injectable()
export class FormEditorService implements IWidgetTypeAbstract {
  HS_DEFAULT_ID = 'workspace';

  widgetConfig = signal<IFormWidgetConfig>({} as IFormWidgetConfig);

  // 是否编辑模式
  isEditMode = signal(true);

  isShowConfigPanel = signal(false);

  // 选中的 Field
  public activeField = signal<IEditorFormlyField | null>(null);

  flatField$ = new BehaviorSubject([]);

  formWidgetId = signal<string | undefined>(undefined);
  fields = signal<IEditorFormlyField[]>([]);
  model = {};

  constructor(
    private formWidgetService: FormWidgetService,
    private _snackBar: MatSnackBar,
  ) {
    effect(
      () => {
        if (this.formWidgetId()) {
          this.fields.set([]);
          // 请求form配置
          this.formWidgetService.getFormWidgetById(this.formWidgetId()!).subscribe({
            next: (widget: IFormWidgetConfig) => {
              this.widgetConfig.set(widget);
              const fieldConfig = widget.flatTypeField as IEditorFormlyField[];
              if (widget.subType === IFormSubTypes.FLAT) {
                // 获取时转换fieldGroup和fieldArray的配置，因为运行需要fieldArray， 开发需要fieldGroup
                const fields = updateField(fieldConfig, (field) => {
                  field.fieldGroup = field.fieldArray.fieldGroup;
                  Reflect.deleteProperty(field, 'fieldArray');
                });
                this.fields.set(fields);
              }
              this.isShowConfigPanel.set(false);
              this.selectField(null);
              this.flatField$.next(this.getFlatField());
            },
            error: (err: any) => console.error('Get widget error:', err),
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  isActiveField(fieldId: string) {
    return this.activeField()?.fieldId === fieldId;
  }

  saveWidgetConfig() {
    // 提交时转换子表 fieldGroup 和 fieldArray.fieldGroup 配置
    const fields = updateField(deepClone(this.fields()), (field) => {
      field.fieldArray = {
        fieldGroup: field.fieldGroup,
      };
      Reflect.deleteProperty(field, 'fieldGroup');
    });

    this.formWidgetService
      .updateFormWidget({
        ...this.widgetConfig(),
        flatTypeField: fields,
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
    this.flatField$.next(this.getFlatField());
  }

  selectField(field: IEditorFormlyField | null): void {
    this.activeField.set(field);
    field && this.isShowConfigPanel.set(true);
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
    return this.isEditMode() ? findSameField(this.fields(), options)[type] : options;
  }

  // get有效字段
  getEffectField() {
    // 提取配置
    const pickConfig: PickConfig = {
      key: true,
      type: true,
      fieldId: true,
      props: true,
      className: true,
      fieldGroup: true,
      fieldArray: true,
    };
    // 运行用的，需要转换
    const fields = updateField(deepClone(this.fields()), (field) => {
      field.fieldArray = {
        fieldGroup: field.fieldGroup,
      };
      Reflect.deleteProperty(field, 'fieldGroup');
    });

    return extractProperties<IEditorFormlyField[]>(fields, pickConfig, 'fieldGroup');
  }

  // 用于代码展示
  getJsonConfig() {
    return JSON.stringify(this.getEffectField(), null, 2);
  }

  // 获取拉平fields，用于大纲展示
  getFlatField(field?: IEditorFormlyField[], level: number = 0) {
    field = field || this.fields();
    return field.reduce((acc, field) => {
      acc.push({
        // @ts-ignore
        name: field.fieldId?.replace('_key', ''),
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
    if ((type === 'column' || type === 'flex' || type === 'subtable') && options[type]) {
      // 暂时都用column进行连接，后面可改为 new Map 来存储 ！
      options['column']!.unshift(fields[i].fieldId as string);
    } else if (type && options[type]) {
      options[type].unshift(fields[i].fieldId as string);
    }

    if (fields[i].fieldGroup) {
      options = findSameField(fields[i].fieldGroup as IEditorFormlyField[], options);
    }
  }
  // @ts-ignore
  return options;
}

function updateField(
  fields: IEditorFormlyField[],
  converCallback: (field: IEditorFormlyField) => void,
) {
  fields.forEach((field) => {
    if (field.fieldGroup) {
      updateField(field.fieldGroup, converCallback);
    }
    if (field.type === IFieldType.SUBTABLE) {
      converCallback(field);
    }
  });
  return fields;
}
