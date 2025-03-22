import { Component, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FormWidgetService } from '@src/app/core/http/widget.service';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IFormSubTypes,
  IFormWidgetConfig,
} from '@src/app/shared/models/form-widget.model';
import {
  IEditorFormlyField,
  IWidgetType,
} from '@src/app/shared/models/widget.model';
@Component({
  selector: 'hs-widget-preview',
  templateUrl: './widget-preview.component.html',
  styleUrls: ['./widget-preview.component.less'],
  imports: [
    MatIconModule,
    MatButtonModule,
    FormlyRunModule,
    MatDividerModule,
    MatDialogModule,
  ],
})
export class WidgetPreviewComponent implements OnInit {
  widgetConfig = signal<IFormWidgetConfig>({
    id: 1,
    type: IWidgetType.FORM,
    subType: IFormSubTypes.FLAT,
    formName: '',
    isUseFlow: false,
    workspaceName: '',
    flatTypeField: [],
  });
  fields = signal<IEditorFormlyField[]>([]);
  formGroup = new FormGroup({});
  model = {};
  options = {};

  constructor(
    private formWidgetService: FormWidgetService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  backWorkSpace() {
    this.router.navigate(['/lowcode/widget']);
  }

  openFormModelDialog() {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.getJsonFormModel.bind(this),
        minHeight: '80vh',
      },
      minWidth: '1200px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getWidgetConfig() {
    const widgetId = this.route.snapshot.paramMap.get('widgetId'); // 获取 ID 参数
    this.formWidgetService.getFormWidgetById(widgetId!).subscribe({
      next: (widget: IFormWidgetConfig) => {
        this.widgetConfig.set(widget);
        const fieldConfig = widget.flatTypeField as IEditorFormlyField[];
        if (
          widget.type === IWidgetType.FORM &&
          widget.subType === IFormSubTypes.FLAT
        ) {
          this.fields.set(fieldConfig);
        }
        this.formGroup = new FormGroup({});
        this.options = {};
      },
      error: (err: any) => console.error('Get widget error:', err),
    });
  }

  getJsonFormModel() {
    return JSON.stringify(this.formGroup.value, null, 2);
  }

  submitModel() {
    this.snackBar.open('功能开发中...', '关闭', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  ngOnInit() {
    this.getWidgetConfig();
  }
}
