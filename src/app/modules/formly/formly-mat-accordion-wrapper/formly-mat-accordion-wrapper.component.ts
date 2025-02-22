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
  selector: 'formly-mat-accordion-wrapper',
  templateUrl: './formly-mat-accordion-wrapper.component.html',
  styleUrls: ['./formly-mat-accordion-wrapper.component.less'],
  imports: [MatExpansionModule, FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyMatAccordionWrapperComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  readonly panelOpenState = signal(false);

  constructor() {
    super();
  }

  ngOnInit() {}
}
