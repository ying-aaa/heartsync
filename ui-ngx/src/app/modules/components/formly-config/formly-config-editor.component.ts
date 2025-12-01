import { Component, effect, input, OnInit } from '@angular/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CONFIT_RESOURCE } from './configs/public-api';
import { FormlyRunModule } from '../../formly/formly-run.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormlyEditorModule } from '../../formly/formly-editor.module';
@Component({
  selector: 'hs-formly-config',
  template: `
    <ng-content></ng-content>
    <ng-scrollbar
      class="w-full h-0 flex-1"
      #scrollbarRef="ngScrollbar"
      externalViewport
      visibility="hover"
      appearance="compact"
    >
      <div scrollViewport>
        <div class="mr-12px">
          <formly-form [form]="formGroup" [fields]="fields" [options]="options()" [model]="model()">
          </formly-form>
        </div>
      </div>
    </ng-scrollbar>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;

        ::ng-deep {
          .mat-mdc-tab-body-wrapper {
            padding: 0;
          }

          .ng-scroll-content {
            --_scrollbar-content-width: 100%;
          }
        }
      }
    `,
  ],
  imports: [FormlyEditorModule, MatDividerModule, NgScrollbarModule],
})
export class FormlyConfigEditorComponent implements OnInit {
  type = input();
  model = input<any>();
  options = input<any>();
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
