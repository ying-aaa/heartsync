import { Component, effect, input, OnInit } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { CONFIT_RESOURCE } from './config/public-api';
import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { FormlyEditorModule } from '@src/app/modules/formly/formly-editor.module';

@Component({
  selector: 'hs-workspace-config',
  templateUrl: './workspace-config.component.html',
  styleUrls: ['./workspace-config.component.less'],
  imports: [FormlyEditorModule, MatDividerModule],
})
export class WorkspaceConfigComponent implements OnInit {
  selectedField = input<any>();
  configForm = new FormGroup({});
  configFields: IEditorFormlyField[] = [];

  constructor() {
    effect(() => {
      this.configFields = this.getFieldConfig(
        this.selectedField()?.type as string,
      );
      this.configForm = new FormGroup({});
    });
  }

  private getFieldConfig(type: string): IEditorFormlyField[] {
    return CONFIT_RESOURCE[type];
  }
  ngOnInit() {}
}
