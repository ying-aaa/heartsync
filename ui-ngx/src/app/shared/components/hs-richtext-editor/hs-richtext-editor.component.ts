import {
  AfterViewInit,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  forwardRef,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';

declare var wangEditor: any;

@Component({
  selector: 'hs-richtext-editor',
  templateUrl: './hs-richtext-editor.component.html',
  styleUrls: ['./hs-richtext-editor.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HsRichtextEditorComponent),
      multi: true,
    },
  ],
})
export class HsRichtextEditorComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  styles = input<object>({ width: '100%', height: '100%' });
  placeholder = input<string>('请输入内容...');
  toolbarKeys = input<string[]>();
  disabled = input<boolean>(false);

  ToolbarContainer = viewChild.required<ElementRef>('ToolbarContainer');
  EditorContainer = viewChild.required<ElementRef>('EditorContainer');

  isDisabled = signal<boolean>(false);

  toolbar: any;
  editor: any;

  @Output() onChange = new EventEmitter<string>();

  private propagateChange = (value: string) => {};

  private contentValue: string = '';

  toolbarConfig = computed(() => {
    const toolbarKeys = this.toolbarKeys();

    return toolbarKeys ? { toolbarKeys } : {};
  });

  constructor(private scriptLoaderService: ScriptLoaderService) {}

  writeValue(value: string): void {
    this.contentValue = value;
    if (this.editor) {
      this.editor.setHtml(value, -1);
    }
  }

  registerOnTouched(fn: () => void): void {
    this.editor?.on('blur', fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (this.editor) {
      isDisabled ? this.editor.disable() : this.editor.enable();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.propagateChange = fn;
  }

  public loadResourceScript() {
    const resourceUrls = [
      '/assets/wangeditor/index.js',
      '/assets/wangeditor/css/style.css',
    ];
    this.scriptLoaderService.loadScripts(resourceUrls).subscribe((res) => {
      this.initEditor();
    });
  }

  initEditor() {
    const { createEditor, createToolbar } = wangEditor;
    const ToolbarContainer = this.ToolbarContainer().nativeElement;
    const EditorContainer = this.EditorContainer().nativeElement;

    const editorConfig = {
      placeholder: this.placeholder(),
      // autoFocus: true,
      scroll: true,
      onCreated: (editor: any) => {
        editor.setHtml(this.contentValue);
        this.isDisabled() ? editor.disable() : editor.enable();
      },
      onChange: (editor: any) => {
        const html = editor.getHtml();
        this.contentValue = html;
        this.onChange.emit(this.contentValue);
        this.propagateChange(this.contentValue);
      },
    };

    this.editor = createEditor({
      selector: EditorContainer,
      html: '<p><br></p>',
      config: editorConfig,
      mode: 'default',
    });

    this.toolbar = createToolbar({
      editor: this.editor,
      selector: ToolbarContainer,
      config: this.toolbarConfig(),
      mode: 'default',
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadResourceScript();
  }

  ngOnDestroy(): void {
    this.toolbar?.destroy();
    this.editor?.destroy();
    this.toolbar = null;
    this.editor = null;
  }
}
