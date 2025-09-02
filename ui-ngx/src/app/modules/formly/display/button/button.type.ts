import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldType } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { ConcatUnitsPipe } from '@shared/pipes/units.pipe';

@Component({
  selector: 'formly-field-button',
  template: `
    @switch (props.type) {
      @case ('icon') {
        <button
          mat-icon-button
          [disabled]="props.disabled"
          [color]="props['color']"
          (click)="onClick($event)"
        >
          <mat-icon>{{ props['icon'] }}</mat-icon>
        </button>
      }

      @case ('fab') {
        <button
          mat-fab
          [style]="field.props?.['styles'] | concatUnits"
          [disabled]="props.disabled"
          [color]="props['color']"
          (click)="onClick($event)"
        >
          <mat-icon>{{ props['icon'] }}</mat-icon>
        </button>
      }

      @case ('mini-fab') {
        <button
          mat-mini-fab
          [style]="field.props?.['styles'] | concatUnits"
          [disabled]="props.disabled"
          [color]="props['color']"
          (click)="onClick($event)"
        >
          <mat-icon>{{ props['icon'] }}</mat-icon>
        </button>
      }

      @case ('extended-fab') {
        <button
          mat-fab
          extended
          [style]="field.props?.['styles'] | concatUnits"
          [disabled]="props.disabled"
          [color]="props['color']"
          (click)="onClick($event)"
        >
          <mat-icon>{{ props['icon'] }}</mat-icon>
          {{ props.label }}
        </button>
      }

      @default {
        <button
          mat-button
          [style]="field.props?.['styles'] | concatUnits"
          [disabled]="props.disabled"
          [color]="props['color']"
          [ngClass]="{
            'mat-mdc-button mat-mdc-raised-button': props.type === 'raised',
            'mat-mdc-unelevated-button': props.type === 'flat',
            'mdc-button--outlined mat-mdc-outlined-button':
              props.type === 'stroked',
            'mat-mdc-button': props.type === 'basic',
          }"
          (click)="onClick($event)"
        >
          @if (props['icon']) {
            <mat-icon>{{ props['icon'] }}</mat-icon>
          }
          {{ props.label }}
        </button>
      }
    }
  `,
  styles: `
    :host {
      --mdc-icon-button-state-layer-size: 40px;
    }
  `,
  imports: [MatButtonModule, MatIconModule, CommonModule, ConcatUnitsPipe],
})
export class FormlyFieldButton
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}

  onClick(event: Event) {
    if (this.props['onClick']) {
      this.props['onClick'](event);
    }
  }
}
