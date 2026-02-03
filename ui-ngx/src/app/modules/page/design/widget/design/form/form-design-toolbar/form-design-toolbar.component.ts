import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { WidgetTitleBackComponent } from '../../toolbar/widget-title-back.component';
import { FormEditorService } from '@src/app/core/services/form-editor.service';

@Component({
  selector: 'hs-form-design-toolbar',
  templateUrl: './form-design-toolbar.component.html',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, WidgetTitleBackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDesignToolbarComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private widgetEditorService: WidgetEditorService,
    private formEditorService: FormEditorService,
  ) {}

  // 预览配置代码
  onPreviewConfigCode() {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.formEditorService.getJsonConfig?.bind(this.formEditorService),
        minHeight: '80vh',
      },
      minWidth: '1200px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // 配置前置数据
  onFrontData() {}

  // 预览部件
  onPreviewWidget() {
    this.widgetEditorService.previewWidget();
  }

  // 保存部件
  onSaveWidget() {
    this.formEditorService.saveWidgetConfig();
  }

  ngOnInit(): void {}
}
