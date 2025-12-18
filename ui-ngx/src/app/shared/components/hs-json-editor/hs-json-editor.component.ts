import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  forwardRef,
  effect,
  signal,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HsThemeService } from '@src/app/core/services/theme.service';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-cloud_editor_dark';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FullscreenDirective } from '../../directive/fullscreen.directive';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hs-json-object-editor',
  templateUrl: './hs-json-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonObjectEditorComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FullscreenDirective, MatDividerModule],
})
export class JsonObjectEditorComponent
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  @Input() placeholder = '请输入...';
  @Input() set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
    this.updateEditorDisabledState();
  }
  get disabled(): boolean {
    return this.isDisabled();
  }
  @Input() toolbar = true;
  @Input() inline = false;
  @Input() title = '编辑器';
  @Input() type: string = 'json';
  @Input() editorStyle: Partial<CSSStyleDeclaration> = {};
  @Input() options: Partial<ace.Ace.EditorOptions> = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showGutter: true,
    showPrintMargin: false,
    printMarginColumn: 80,
    showFoldWidgets: true,
    animatedScroll: true,
    highlightActiveLine: true,
    highlightSelectedWord: true,
    indentedSoftWrap: true,
    useWorker: true,
    mergeUndoDeltas: 'always',
    tabSize: 2,
  };

  @Output() onChange = new EventEmitter<string>();

  isDisabled = signal<boolean>(false);
  private _touchedCallback: () => void = () => {};
  private _contentValue = '';
  editor: ace.Ace.Editor | null = null;
  fullscreen = false;

  private isSettingValue = false;

  constructor(
    private el: ElementRef,
    private hsThemeService: HsThemeService,
    private ngZone: NgZone,
  ) {
    effect(
      () => {
        this.hsThemeService.currentTheme();
        this.loadTheme();
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      this.isDisabled();
      this.updateEditorDisabledState();
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initEditor();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }

  private initEditor(): void {
    if (this.editor) return;

    const editorEl = this.el.nativeElement.querySelector('.editor');
    if (!editorEl) {
      console.warn('编辑器容器未找到');
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.editor = ace.edit(editorEl);
      const session = this.editor.getSession();

      this.editor.setOptions({ ...this.options });
      session.setMode(`ace/mode/${this.type}`);
      session.setTabSize(this.options.tabSize || 2);
      this.editor.setFontSize(16);

      this.editor.on('change', () => {
        if (this.isSettingValue || !this.editor) return;

        const newValue = this.editor.getValue();

        if (newValue !== this._contentValue) {
          this._contentValue = newValue;

          this.ngZone.run(() => {
            this.onChange.emit(this._contentValue);
            this.propagateChange(this._contentValue);
          });
        }
      });

      this.editor.on('blur', () => {
        this.ngZone.run(() => this._touchedCallback());
      });
    });

    this.loadTheme();
    // this.setPlaceholder();

    if (this._contentValue) {
      this.setValueSafe(this._contentValue);
    }

    this.registerEditorCommands();
    this.updateEditorDisabledState();
  }

  private loadTheme(): void {
    if (!this.editor) return;
    const theme =
      this.hsThemeService.currentTheme() === 'dark'
        ? 'ace/theme/cloud_editor_dark'
        : 'ace/theme/chrome';
    this.editor.setTheme(theme);
  }

  private registerEditorCommands(): void {
    if (!this.editor) return;
    this.editor.commands.addCommand({
      name: 'formatCode',
      bindKey: { win: 'Ctrl-Shift-F', mac: 'Command-Shift-F' },
      exec: () => this.formatCode(),
      readOnly: false,
    });
    this.editor.commands.addCommand({
      name: 'compressCode',
      bindKey: { win: 'Ctrl-Shift-M', mac: 'Command-Shift-M' },
      exec: () => this.compressCode(),
      readOnly: false,
    });
  }

  private updateEditorDisabledState(): void {
    if (!this.editor) return;
    this.editor.setReadOnly(this.isDisabled());
  }

  private setValueSafe(value: string) {
    if (!this.editor) return;
    this.isSettingValue = true;
    this.editor.setValue(value, -1);
    this.editor.clearSelection();
    this.isSettingValue = false;
  }

  writeValue(value: string | null | undefined): void {
    const normalizeValue = value || '';
    if (this.editor && this.editor.getValue() === normalizeValue) {
      return;
    }

    this._contentValue = normalizeValue;
    this.setValueSafe(this._contentValue);
  }

  private propagateChange = (value: string) => {};
  registerOnChange(fn: (value: string) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._touchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  formatCode(): void {
    if (!this.editor || this.type !== 'json') return;
    try {
      const value = this.editor.getValue();
      if (!value.trim()) return;
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      this.setValueSafe(formatted);
    } catch (e) {
      console.error('JSON格式化失败：', e);
    }
  }

  compressCode(): void {
    if (!this.editor || this.type !== 'json') return;
    try {
      const value = this.editor.getValue();
      if (!value.trim()) return;
      const parsed = JSON.parse(value);
      const compressed = JSON.stringify(parsed);
      this.setValueSafe(compressed);
    } catch (e) {
      console.error('JSON压缩失败：', e);
    }
  }

  toggleFullscreen(): void {
    this.fullscreen = !this.fullscreen;
    setTimeout(() => this.editor?.resize(), 0);
  }
}
