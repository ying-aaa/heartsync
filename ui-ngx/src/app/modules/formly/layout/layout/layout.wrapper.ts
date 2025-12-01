import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'formly-wrapper-control',
  template: `
    @let props = field.props || {};
    @let float = props['layout'] === 'float';
    @let left = props['layout'] === 'left';
    @let right = props['layout'] === 'right';
    @let top = props['layout'] === 'top';
    @let bottom = props['layout'] === 'bottom';
    @let lableWidth = props['labelWidth'] || '80px';
    @let hideColon = props['hideColon'];
    @let leftOrRright = left || right;

    <div
      class="flex"
      [class]="{
        'items-center': leftOrRright,
        'flex-col': top,
        'flex-col-reverse': bottom,
      }"
    >
      @if (!float) {
        <div
          class="text-14px mb-8px color-[var(--base-color-80)]"
          [class]="{
            'mb-8px': top,
            'mt-8px': bottom,
            'mr-8px': leftOrRright,
            'text-left': left,
            'text-right': right,
          }"
          [style]="
            leftOrRright ? { width: lableWidth, 'min-width': lableWidth, 'max-width': '90%' } : {}
          "
        >
          {{ props.label }}
          @if (leftOrRright && !hideColon) {
            <span>:</span>
          }
        </div>
      }
      <!-- {{ field.props?.['wrapperAttr']?.backgroundColor }} -->
      <div [class]="leftOrRright ? 'flex-1 w-0' : ''">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
})
export class FormlyWrapperLayout
  extends FieldWrapper<IEditorFormlyField>
  implements OnInit, OnDestroy
{
  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
