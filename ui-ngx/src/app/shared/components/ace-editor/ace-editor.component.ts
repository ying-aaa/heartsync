import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-cloud_editor_dark';
import 'ace-builds/src-noconflict/theme-chrome';

@Component({
  selector: 'hs-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AceEditorComponent),
      multi: true,
    },
  ],
})
export class AceEditorComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @Input() type: string = 'html';
  @Input() theme: string = 'monokai';
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
  editor: any;
  private el: ElementRef;
  private propagateChange = (value: string) => {};
  private contentValue: string = '';

  constructor(el: ElementRef) {
    this.el = el;
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
    this.editor.setValue(this.contentValue);
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseTab(true);
    this.editor.on('change', () => {
      this.contentValue = this.editor.getValue();
      this.onChange.emit(this.contentValue);
      this.propagateChange(this.contentValue);
    });
  }

  loadTheme(): void {
    switch (this.theme) {
      case 'cloud_editor_dark':
        this.editor.setTheme('ace/theme/cloud_editor_dark');
        break;
      case 'chrome':
        this.editor.setTheme('ace/theme/chrome');
        break;
      default:
        this.editor.setTheme('ace/theme/cloud_editor_dark');
    }
  }

  writeValue(value: string): void {
    this.contentValue = value;
    if (this.editor) {
      this.editor.setValue(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.editor.on('blur', fn);
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
