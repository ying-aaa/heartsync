import {
  Component,
  computed,
  HostListener,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IRadioConfig } from '@src/app/shared/models/system.model';

@Component({
  selector: 'hs-widget-zoom',
  templateUrl: './widget-zoom.component.html',
  styleUrls: ['./widget-zoom.component.less'],
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    HsRadioComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class WidgetZoomComponent implements OnInit {
  activeType = signal('mouse');
  isMovable = computed(() => this.activeType() === 'front_hand');

  scale = signal(1);
  transformScale = computed(() => `scale(${this.scale()}) !important`);

  types: IRadioConfig[] = [
    { value: 'mouse', icon: 'mouse' },
    { value: 'front_hand', icon: 'front_hand' },
  ];

  @HostListener('window:keydown.space', ['$event'])
  onSpaceKeyDown(event: KeyboardEvent) {
    this.activeType.set('front_hand');
    this.setMouseCursor('grabbing');
  }

  @HostListener('window:keyup.space', ['$event'])
  onSpaceKeyUp(event: KeyboardEvent) {
    this.activeType.set('mouse');
    this.setMouseCursor('default');
  }

  @HostListener('window:wheel', ['$event'])
  onSpaceWheel(event: WheelEvent) {
    const targetElement = event.target as HTMLElement;
    if (!event.ctrlKey) return;
    if (
      targetElement.classList.contains('widget-content-wrapper') ||
      targetElement.classList.contains('viewport-overlay-layer')
    ) {
      event.preventDefault();
      this.scale.update((scale) => {
        scale += event.deltaY < 0 ? 0.1 : -0.1;
        scale = +Math.max(0.1, Math.min(5, scale)).toFixed(1); // 限制缩放范围
        return scale;
      });
    }
  }

  setMouseCursor(cursor: string) {
    document.body.style.cursor = cursor;
  }

  constructor() {}

  ngOnInit() {}
}
