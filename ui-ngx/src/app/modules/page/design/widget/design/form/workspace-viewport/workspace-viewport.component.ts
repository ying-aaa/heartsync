import { Component, Inject, input, OnInit, Optional } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigOption, FORMLY_CONFIG, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FormEditorService } from '@core/services/form-editor.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormlyEditorModule } from '@src/app/modules/formly/formly-editor.module';

@Component({
  selector: 'hs-workspace-viewport',
  templateUrl: './workspace-viewport.component.html',
  styleUrls: ['./workspace-viewport.component.less'],
  imports: [MatDividerModule, FormlyEditorModule, NgScrollbarModule],
})
export class WorkspaceViewportComponent implements OnInit {
  options = input.required<FormlyFormOptions>();

  formGroup = new FormGroup({});

  constructor(
    public formEditorService: FormEditorService,
    @Optional() @Inject(FORMLY_CONFIG) configs: ConfigOption[] = [],
  ) {}

  get getJsonConfig() {
    return this.formEditorService.getJsonConfig();
  }

  syncFormilyForm() {
    this.formGroup = new FormGroup({});
    if (this.options().build) {
      this.options().build!();
    }
  }

  ngOnInit() {}
}
