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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HsThemeService } from '@src/app/core/services/theme.service';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-cloud_editor_dark';
import 'ace-builds/src-noconflict/theme-chrome';
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
  imports: [MatButtonModule, MatIconModule, FullscreenDirective, MatDividerModule],
})
export class JsonObjectEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() placeholder = '请划动区域...';
  @Input() disabled = false;
  @Input() toolbar: boolean = true;
  @Input() inline: boolean = false;
  @Input() title: string = '编辑器';
  @Input() type: string = 'html';
  @Input() editorStyle: any = {};
  @Input() options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showGutter: true,
    showPrintMargin: true,
    printMarginColumn: 80,
    showFoldWidgets: true,
    animatedScroll: true,
    highlightActiveLine: true,
    highlightSelectedWord: true,
    indentedSoftWrap: true,
    useWorker: true,
    mergeUndoDeltas: 'always',
    tasSize: 2,
  };

  @Output() onChange = new EventEmitter<string>();

  isDisabled = signal<boolean>(false);

  editor: any;

  fullscreen = false;

  private el: ElementRef;
  private propagateChange = (value: string) => {};
  private contentValue: string = '';

  constructor(
    el: ElementRef,
    private HsThemeService: HsThemeService,
  ) {
    this.el = el;
    effect(() => {
      this.loadTheme();
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initEditor();
  }

  initEditor(): void {
    this.editor = ace.edit(this.el.nativeElement.querySelector('.editor'));
    this.editor.getSession().setMode(`ace/mode/${this.type}`);
    this.editor.setOptions(this.options);
    this.editor.setShowPrintMargin(false);
    this.loadTheme();
    this.editor.setFontSize(16);
    this.editor.setValue(this.contentValue, -1);
    this.editor.getSession().setTabSize(2);
    // this.editor.getSession().setUseTab(true);
    this.editor.on('change', () => {
      this.contentValue = this.editor.getValue();
      this.onChange.emit(this.contentValue);
      this.propagateChange(this.contentValue);
    });
  }

  loadTheme(): void {
    const theme = this.HsThemeService.currentTheme() === 'dark' ? 'cloud_editor_dark' : 'chrome';
    if (!this.editor) return;
    this.editor.setTheme(`ace/theme/${theme}`);
  }

  writeValue(value: string): void {
    this.contentValue = value;
    if (this.editor) {
      this.editor.setValue(value, -1);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.editor?.on('blur', fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.editor) {
      this.editor.setReadOnly(isDisabled);
    }
  }

  formatCode(): void {
    this.editor.commands.addCommand({
      name: 'formatCode',
      bindKey: { win: 'Ctrl-Shift-F', mac: 'Command-Shift-F' },
      exec: () => {
        this.editor.getSession().setUseWrapMode(true);
        this.editor.getSession().setWrapLimitRange(null, null);
        this.editor.getSession().setWrapMode('free');
      },
    });
  }

  compressCode(): void {
    const res = JSON.stringify(this.editor.getValue());
    this.editor.setValue(res, -1);

    this.editor.commands.addCommand({
      name: 'compressCode',
      bindKey: { win: 'Ctrl-Shift-M', mac: 'Command-Shift-M' },
      exec: () => {},
    });
  }
}
