import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { Router } from '@angular/router';
import { IWidgetType } from '@src/app/shared/models/widget.model';

@Component({
  selector: 'hs-workspace-toobar',
  templateUrl: './workspace-toobar.component.html',
  styleUrls: ['./workspace-toobar.component.css'],
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceToobarComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    public formEditorService: FormEditorService,
  ) {}

  ngOnInit() {}

  updateFields() {
    this.formEditorService.updateFields();
  }

  previewWidget() {
    const widgetId = this.formEditorService.fieldsId();
    this.router.navigate([`/design/widget/preview`], {
      queryParams: { widgetId },
    });
  }

  openFieldCode() {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.formEditorService.getJsonField.bind(this.formEditorService),
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
