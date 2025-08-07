import { Component, input, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { WidgetFormComponent } from '@src/app/modules/components/widget-form/widget-form.component';
import { PreviewToolbarComponent } from './preview-toolbar.component';
@Component({
  selector: 'hs-form-preview',
  template: `
    <hs-preview-toolbar>
      <button
        mat-button
        (click)="openFormModelDialog()"
      >
        <mat-icon matChipAvatar>settings_ethernet</mat-icon>
        查看填写信息
      </button>

      <button
        mat-flat-button
        color="accent"
        (click)="submitModel()"
        class="px-16px! mx-12px"
      >
        <mat-icon matChipAvatar>save</mat-icon> 提交
      </button>
    </hs-preview-toolbar>
    <div class="w-80% mx-auto my-20px">
      <hs-widget-form
        [widgetId]="widgetId()"
        #WidgetForm
      >
      </hs-widget-form>
    </div>
  `,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    WidgetFormComponent,
    PreviewToolbarComponent,
  ],
  host: {
    class: 'block relative',
  },
})
export class FormPreviewComponent implements OnInit {
  widgetId = input<string>('');

  widgetForm = viewChild.required<WidgetFormComponent>('WidgetForm');

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

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

  submitModel() {
    this.snackBar.open('功能开发中...', '关闭', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getJsonFormModel() {
    return JSON.stringify(this.widgetForm().model, null, 2);
  }

  ngOnInit() {}
}
