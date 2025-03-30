import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  HostListener,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IWidgetSizeStyle } from '@src/app/shared/models/public-api';
import { IRadioConfig } from '@src/app/shared/models/system.model';

@Component({
  selector: 'hs-widget-zoom',
  templateUrl: './widget-zoom.component.html',
  styleUrls: ['./widget-zoom.component.less'],
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatIconModule,
    HsRadioComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class WidgetZoomComponent implements OnInit, AfterViewInit {
  containerElement = input.required<HTMLElement>();
  workSizeConfigStyle = input.required<IWidgetSizeStyle>();

  containerWidth = 0;

  scale = signal(1);
  activeType = signal('mouse');
  scaleSelectValue = 'custom';

  currentScaleStr = computed(() => `当前： ${Math.trunc(this.scale() * 100)}%`);

  isMovable = computed(() => this.activeType() === 'hand');
  transformScale = computed(() => `scale(${this.scale()}) !important`);

  types: IRadioConfig[] = [
    { value: 'mouse', icon: 'mouse' },
    { value: 'hand', icon: 'front_hand' },
  ];

  scaleOptions = [
    { value: 30, label: '缩放：30%' },
    { value: 50, label: '缩放：50%' },
    { value: 80, label: '缩放：80%' },
    { value: 100, label: '缩放：100%' },
    { value: 'custom', label: '自适应' },
  ];

  constructor() {
    effect(() => {
      // 检测 workSizeConfigStyle 变更，大于容器宽度时，重新计算最佳比例
      this.customContainerWidth();
    });
  }

  @HostListener('window:keydown.space', ['$event'])
  onSpaceKeyDown(event: KeyboardEvent) {
    this.activeType.set('hand');
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
      targetElement.classList.contains('widget-wrapper') ||
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

  @HostListener('window:resize')
  onResize() {
    this.updateContainerWidth();
  }

  setMouseCursor(cursor: string) {
    document.body.style.cursor = cursor;
  }

  updateContainerWidth() {
    if (this.containerElement()) {
      this.containerWidth = this.containerElement().offsetWidth;
    }
  }

  customContainerWidth() {
    const { width, widthUnits } = this.workSizeConfigStyle() || {};

    // 切换设备时恢复默认自适应
    this.scaleSelectValue = 'custom';

    if (width && widthUnits !== '%') {
      if (width > this.containerWidth) {
        this.scale.update((scale) => {
          scale = +((this.containerWidth - 24) / width);
          return scale;
        });
      }
    }
  }

  onSelectionChange({ value }: { value: string }) {
    if (value === 'custom') {
      this.customContainerWidth();
    } else {
      this.scale.set(+value / 100);
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.updateContainerWidth();
  }
}
