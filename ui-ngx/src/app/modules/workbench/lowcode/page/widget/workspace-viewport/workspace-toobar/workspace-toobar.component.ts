import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { Router } from '@angular/router';

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
    public widgetEditorService: WidgetEditorService,
  ) {}

  ngOnInit() {}

  updateFields() {
    this.widgetEditorService.updateFields();
  }

  previewWidget() {
    // window.open(`/lowcode/preview/${this.widgetEditorService.fieldsId()}`);

    this.router.navigate([
      '/lowcode/preview',
      this.widgetEditorService.fieldsId(),
    ]);
  }

  openFieldCode() {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.widgetEditorService.getJsonField.bind(
          this.widgetEditorService,
        ),
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
