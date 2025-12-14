import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

import { FieldType, FormlyModule } from '@ngx-formly/core';

import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'formly-field-accordion',
  templateUrl: './accordion.type.html',
  styleUrls: ['./accordion.type.less'],
  imports: [MatExpansionModule, FormlyModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldAccordion extends FieldType<IEditorFormlyField> implements OnInit {
  readonly panelOpenState = signal(false);

  constructor() {
    super();
  }

  ngOnInit() {}
}
