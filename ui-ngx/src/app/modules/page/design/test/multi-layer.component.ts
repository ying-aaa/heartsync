import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HsRichtextEditorComponent } from '@src/app/shared/components/hs-wang-editor/hs-richtext-editor.component';

@Component({
  selector: 'app-swap',
  templateUrl: './multi-layer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HsRichtextEditorComponent, FormsModule, ReactiveFormsModule],
})
export class MultiLayerComponent implements OnInit {
  value = '';

  disabled = false;

  onChange(value: string): void {
    console.log('onChange:', value);
  }

  ngOnInit(): void {
  }
}
