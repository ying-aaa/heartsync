// inline-editor.component.ts
import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit,
  Output,
  ViewChild
} from '@angular/core';
@Component({
  selector: 'hs-inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.less'],
  standalone: false
})
export class HsInlineEditorComponent implements OnInit, OnDestroy {
  @ViewChild('inputRef') inputRef: ElementRef;

  @Input() type = "text";
  @Input() showButton = true;

  @Output() ngModelChange = new EventEmitter();
  @Output() editFinish = new EventEmitter();

  isEdit = false;

  textValue = "你好世界";

  constructor() {

  }

  changeValue(event: any) {
    this.ngModelChange.emit(event);
  }

  editTriggerEvent() {
    this.isEdit = true;
    setTimeout(() => {
      this.inputRef.nativeElement.focus();
    }, 0);
  }

  editFinishEvent(event: any) {
    this.isEdit = false;
    this.editFinish.emit(event.target.value);
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
}