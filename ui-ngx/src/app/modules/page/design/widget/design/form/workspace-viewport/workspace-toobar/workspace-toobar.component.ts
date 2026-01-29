import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hs-workspace-toobar',
  templateUrl: './workspace-toobar.component.html',
  styleUrls: ['./workspace-toobar.component.css'],
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceToobarComponent implements OnInit {
  appId: string = getParamFromRoute('appId', this.route)!;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public formEditorService: FormEditorService,
    public widgetEditorService: WidgetEditorService,
  ) {}

  ngOnInit() {}

  updateFields() {
    this.formEditorService.saveWidgetConfig();
  }

  previewWidget() {
    const widgetId = this.formEditorService.formWidgetId()!;
    this.widgetEditorService.previewWidget(
      this.appId,
      widgetId,
      IWidgetType.FORM,
    );
  }

  openFieldCode() {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.formEditorService.getJsonConfig.bind(this.formEditorService),
        minHeight: '80vh',
      },
      minWidth: '1200px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
