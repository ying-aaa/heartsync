import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import {
  IEditorFormlyField,
  IWidgetType,
} from '@src/app/shared/models/widget.model';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'hs-widget-preview',
  templateUrl: './widget-preview.component.html',
  styleUrls: ['./widget-preview.component.less'],
  imports: [
    MatIconModule,
    MatButtonModule,
    FormlyMaterialModule,
    MatInputModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    FormlyModule,
    FormsModule,
    NgScrollbarModule,
    MatDividerModule,
    FormlyMatToggleModule,
    FormlyMatSliderModule,
  ],
})
export class WidgetPreviewComponent implements OnInit {
  widgetName = '';
  fields = signal<IEditorFormlyField[]>([]);
  formGroup = new FormGroup({});
  model = {};
  options = {};

  constructor(
    // private formWidgetService: formWidgetService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  backWorkSpace() {
    this.router.navigate(['/lowcode/widget']);
  }

  ngOnInit() {
    const widgetId = this.route.snapshot.paramMap.get('widgetId'); // 获取 ID 参数

    // this.widgetService.getWidgetById(widgetId!).subscribe({
    //   next: (widget: WidgetConfig) => {
    //     // this.fields.set(JSON.parse(widget.config));
    //     const fieldConfig = JSON.parse(widget.fieldConfig as string);
    //     if (
    //       fieldConfig.type === IWidgetType.FORM &&
    //       fieldConfig.subType === IFormSubTypes.GRID
    //     ) {
    //       this.fields.set(JSON.parse(fieldConfig.formConfig));
    //     }
    //     this.widgetName = widget.title!;
    //     this.formGroup = new FormGroup({});
    //     this.options = {};
    //   },
    //   error: (err: any) => console.error('Get widget error:', err),
    // });
  }
}
