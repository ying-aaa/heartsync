import { Component, effect, input, OnInit } from '@angular/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CONFIT_RESOURCE } from './configs/public-api';
import { FormlyRunModule } from '../../formly/formly-run.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
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
        <formly-form [form]="formGroup" [fields]="fields" [options]="options()" [model]="model()">
        </formly-form>
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
  imports: [FormlyRunModule, MatDividerModule, NgScrollbarModule],
})
export class FormlyConfigComponent implements OnInit {
  type = input();
  model = input<any>({});
  options = input<any>({ formState: { model: this.model() } });
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
