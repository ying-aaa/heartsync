import { Component, effect, input, OnInit } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { CONFIT_RESOURCE } from './field-config.ts/public-api';
import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hs-workspace-config',
  templateUrl: './workspace-config.component.html',
  styleUrls: ['./workspace-config.component.less'],
  imports: [FormlyModule, MatDividerModule],
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
