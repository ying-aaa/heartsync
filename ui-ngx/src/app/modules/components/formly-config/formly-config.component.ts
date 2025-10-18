import { Component, effect, input, OnInit } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { FormlyEditorModule } from '@src/app/modules/formly/formly-editor.module';
import { CONFIT_RESOURCE } from './configs/public-api';
@Component({
  selector: 'hs-formly-config',
  templateUrl: './formly-config.component.html',
  styleUrls: ['./formly-config.component.less'],
  imports: [FormlyEditorModule, MatDividerModule],
})
export class FormlyConfigComponent implements OnInit {
  type = input();
  model = input<any>();
  fields: IEditorFormlyField[] = [];
  formGroup = new FormGroup({});

  constructor() {
    effect(() => {
      const type: string = this.type() || this.model()?.type;
      this.fields = this.getFieldConfig(type);
      this.formGroup = new FormGroup({});
    });
  }

  private getFieldConfig(type: string): IEditorFormlyField[] {
    return CONFIT_RESOURCE[type];
  }
  ngOnInit() {}
}
