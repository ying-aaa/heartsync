import {
  Component,
  input,
  InputSignal,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HighlightModule } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { NgScrollbar } from 'ngx-scrollbar';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'hs-code',
  template: `
    <button
      mat-mini-fab
      color="primary"
      aria-label="Example icon button with a menu icon"
      class="right-12px top-12px absolute! w-28px! h-28px! z-999"
      [cdkCopyToClipboard]="code() || data.code()"
    >
      <mat-icon class="text-18px! w-18px! h-18px!">content_copy</mat-icon>
    </button>
    <ng-scrollbar
      class="relative"
      appearance="compact"
      class="wh-full"
    >
      <pre [style]="{ minHeight: minHeight() || data.minHeight }">
        <code [highlightAuto]="code() || data.code()" lineNumbers></code>
      </pre>
    </ng-scrollbar>
  `,
  styleUrl: './hs-code.component.less',
  imports: [
    HighlightModule,
    HighlightLineNumbers,
    NgScrollbar,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HsCodeComponent {
  readonly code: InputSignal<string | undefined> = input<string | undefined>();
  readonly minHeight: InputSignal<string | undefined> = input<
    string | undefined
  >();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { code: any; minHeight: string },
  ) {}
}
