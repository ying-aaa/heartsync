import { Component, computed, viewChild } from '@angular/core';
import { WidgetZoomComponent } from './widget-zoom.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetContainerComponent } from './widget-container.component';
import { Router } from '@angular/router';
import { IWidgetSizeStyle } from '@src/app/shared/models/public-api';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
@Component({
  selector: 'hs-widget-preview',
  templateUrl: './widget-preview.component.html',
  styleUrls: ['./widget-preview.component.less'],
  imports: [
    MatButtonModule,
    MatIconModule,
    WidgetContainerComponent,
    MatDividerModule,
  ],
  host: {
    class: 'block relative',
  },
})
export class WidgetPreviewComponent {
  zoomControl = viewChild.required<WidgetZoomComponent>('ZoomControl');
  workSizeConfigStyle = {} as IWidgetSizeStyle;

  constructor(
    private widgetEditorService: WidgetEditorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  workSizeConfig = computed(
    () => this.widgetEditorService.currentWidgetConfig().workSizeConfig,
  );

  backWorkSpace() {
    const widgetId = this.widgetEditorService.currentWidgetId();
    const widgetType = this.widgetEditorService.currentWidgetType();
    this.router.navigate([`/design/widget/${widgetType}`], {
      queryParams: { widgetId },
    });
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

  submitModel() {
    this.snackBar.open('功能开发中...', '关闭', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getJsonFormModel() {
    // return JSON.stringify(this.formGroup.value, null, 2);
  }
}
