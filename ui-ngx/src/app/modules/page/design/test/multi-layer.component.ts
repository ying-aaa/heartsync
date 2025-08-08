import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HsDrawComponent } from '@src/app/shared/components/hs-draw/hs-draw.component';

@Component({
  selector: 'app-swap',
  templateUrl: './multi-layer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HsDrawComponent, FormsModule, ReactiveFormsModule],
})
export class MultiLayerComponent implements OnInit {
  value = []

  disabled = false;

  onChange(value: string): void {
    console.log('onChange:', value);
  }

  ngOnInit(): void {}
}
