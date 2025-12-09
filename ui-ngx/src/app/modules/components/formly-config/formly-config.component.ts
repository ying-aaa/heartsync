import { Component, effect, input, OnInit } from '@angular/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CONFIT_RESOURCE } from './configs/public-api';
import { FormlyRunModule } from '../../formly/formly-run.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
@Component({
  selector: 'hs-formly-config',
  template: `
    <ng-content></ng-content>
    <button mat-button (click)="openFormModelDialog()">
      <mat-icon matChipAvatar>settings_ethernet</mat-icon>
      查看填写信息
    </button>
    <ng-scrollbar
      class="h-0 flex-1"
      #scrollbarRef="ngScrollbar"
      externalViewport
      visibility="hover"
      appearance="compact"
    >
      <div scrollViewport>
        <div class="pr-12px">
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
  imports: [FormlyRunModule, MatDividerModule, NgScrollbarModule, MatButton, MatIconModule],
})
export class FormlyConfigComponent implements OnInit {
  type = input();
  model = input<any>({});
  options = input<any>({ formState: { model: this.model() } });
  fields: IEditorFormlyField[] = [];
  formGroup = new FormGroup({});

  constructor(private dialog: MatDialog) {
    effect(() => {
      const type: string = this.type() || this.model()?.type;
      this.fields = this.getFieldConfig(type);
      this.formGroup = new FormGroup({});
    });
  }

  private getFieldConfig(type: string): IEditorFormlyField[] {
    return CONFIT_RESOURCE[type];
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

  getJsonFormModel() {
    return JSON.stringify(this.model(), null, 2);
  }

  ngOnInit() {}
}
