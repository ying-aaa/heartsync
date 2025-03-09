import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';

import { FieldType, FormlyModule } from '@ngx-formly/core';

import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'formly-field-accordion',
  templateUrl: './formly-field-accordion.component.html',
  styleUrls: ['./formly-field-accordion.component.less'],
  imports: [MatExpansionModule, FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldAccordionComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  readonly panelOpenState = signal(false);

  constructor() {
    super();
  }

  ngOnInit() {}
}
