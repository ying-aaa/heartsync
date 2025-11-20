import {
  Component,
  input,
  InputSignal,
  ChangeDetectionStrategy,
  Inject,
  inject,
  effect,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HighlightLoader, HighlightModule } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { NgScrollbar } from 'ngx-scrollbar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'hs-code',
  template: `
    <button
      mat-mini-fab
      color="primary"
      aria-label="复制"
      class="right-16px top-16px absolute! w-32px! h-32px! z-999"
      [cdkCopyToClipboard]="code() || data.code()"
      (click)="sendCopyTips()"
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
    MatFormFieldModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HsCodeComponent {
  readonly code: InputSignal<string | undefined> = input<string | undefined>();
  readonly minHeight: InputSignal<string | undefined> = input<
    string | undefined
  >();

  private readonly hljsLoader: HighlightLoader = inject(HighlightLoader);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { code: any; minHeight: string },
    private HsThemeService: HsThemeService,
    private _snackBar: MatSnackBar,
  ) {
    effect(() => {
      this.hljsLoader.setTheme(
        `atom-one-${this.HsThemeService.currentTheme()}.css`,
      );
    });
  }

  sendCopyTips() {
    this._snackBar.open('复制成功!!!', '确定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3 * 1000,
    });
  }
}
