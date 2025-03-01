import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'formly-field-mat-accordion',
  templateUrl: './formly-field-mat-accordion.component.html',
  styleUrls: ['./formly-field-mat-accordion.component.less'],
  imports: [MatExpansionModule, FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldMatAccordionComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  readonly panelOpenState = signal(false);

  constructor() {
    super();
  }

  ngOnInit() {}
}
