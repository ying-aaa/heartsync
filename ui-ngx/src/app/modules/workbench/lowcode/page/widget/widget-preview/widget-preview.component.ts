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
  IFormSubTypes,
  IFormWidgetConfig,
} from '@src/app/shared/models/form-widget.model';
import {
  IEditorFormlyField,
  IWidgetType,
} from '@src/app/shared/models/widget.model';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormWidgetService } from '@src/app/core/http/widget.service';

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
  model = {
    5758231678674854: [
      {
        '5107960635885452': '111',
        '9449838446880347': 222,
        '8392897339114017': '333',
      },
    ],
  };
  options = {};

  constructor(
    private formWidgetService: FormWidgetService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  backWorkSpace() {
    this.router.navigate(['/lowcode/widget']);
  }

  ngOnInit() {
    const widgetId = this.route.snapshot.paramMap.get('widgetId'); // 获取 ID 参数
    this.formWidgetService.getFormWidgetById(widgetId!).subscribe({
      next: (widget: IFormWidgetConfig) => {
        const fieldConfig = widget.flatTypeField as IEditorFormlyField[];
        if (
          widget.type === IWidgetType.FORM &&
          widget.subType === IFormSubTypes.FLAT
        ) {
          this.fields.set(fieldConfig);
        }
        // this.formGroup = new FormGroup({});
        this.options = {};
      },
      error: (err: any) => console.error('Get widget error:', err),
    });
  }
}
