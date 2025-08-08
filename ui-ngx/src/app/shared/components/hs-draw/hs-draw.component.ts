import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { download } from '@src/app/core/utils';
import { ColorPickerDirective } from 'ngx-color-picker';
import SignaturePad, { PointGroup } from 'signature_pad';

@Component({
  selector: 'hs-draw',
  templateUrl: './hs-draw.component.html',
  styleUrls: ['./hs-draw.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HsDrawComponent),
      multi: true,
    },
  ],
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    ColorPickerDirective,
  ],
})
export class HsDrawComponent implements OnInit, AfterViewInit, OnDestroy {
  styles = input<object>({ width: '100%', height: '100%' });
  placeholder = input<string>('请划动区域...');
  disabled = input<boolean>(false);

  @Output() onChange = new EventEmitter<PointGroup[]>();
  private propagateChange = (value: PointGroup[]) => {};
  private contentValue: PointGroup[] = [];

  isDisabled = signal<boolean>(false);

  canvasContainter = viewChild.required<ElementRef>('canvasContainter');

  signaturePad: SignaturePad;

  undoData: PointGroup[] = [];

  color = signal<string>(this.hsThemeService.getBaseColor(1));

  currentTheme$ = toObservable(this.hsThemeService.currentTheme);

  toolbarBtns = [
    {
      icon: 'undo',
      tooltip: '撤销',
      action: () => {
        const data = this.signaturePad.toData();

        if (data && data.length > 0) {
          const removed = data.pop();
          this.undoData.push(removed!);
          this.contentValue = data;
          this.signaturePad.fromData(data);
          this.onChange.emit(this.contentValue);
          this.propagateChange(this.contentValue);
        }
      },
    },
    {
      icon: 'redo',
      tooltip: '重做',
      action: () => {
        if (this.undoData.length > 0) {
          const data = this.signaturePad.toData();
          data.push(this.undoData.pop()!);
          this.contentValue = data;
          this.signaturePad.fromData(data);
          this.onChange.emit(this.contentValue);
          this.propagateChange(this.contentValue);
        }
      },
    },
    {
      icon: 'delete',
      tooltip: '清除',
      action: () => {
        this.signaturePad.clear();
        const data = this.signaturePad.toData();
        this.contentValue = data;
        this.onChange.emit(this.contentValue);
        this.propagateChange(this.contentValue);
      },
    },
    {
      icon: 'local_printshop',
      tooltip: '打印',
      action: () => {
        console.log(
          '%c Line:86 🥟',
          'color:#f5ce50',
          this.signaturePad.toData(),
        );
      },
    },
    // 更多
    {
      icon: 'more_vert',
      tooltip: '导出',
      children: [
        {
          tooltip: '导出 PNG',
          action: () => {
            this.signaturePad.toDataURL('image/png');
            if (this.signaturePad.isEmpty()) {
              alert('请先提供签名');
            } else {
              const dataURL = this.signaturePad.toDataURL();
              download(dataURL, 'heartsync-draw.png');
            }
          },
        },
        {
          tooltip: '导出 JPEG',
          action: () => {
            if (this.signaturePad.isEmpty()) {
              alert('请先提供签名');
            } else {
              const dataURL = this.signaturePad.toDataURL('image/jpeg');
              download(dataURL, 'heartsync-draw.jpg');
            }
          },
        },
        {
          tooltip: '导出 SVG',
          action: () => {
            if (this.signaturePad.isEmpty()) {
              alert('请先提供签名');
            } else {
              const dataURL = this.signaturePad.toDataURL('image/svg+xml');
              download(dataURL, 'heartsync-draw.svg');
            }
          },
        },
      ],
    },
  ];

  constructor(private hsThemeService: HsThemeService) {
    this.currentTheme$.subscribe(() => {
      const color = this.hsThemeService.getBaseColor(1);
      this.color.set(color);
      if (this.signaturePad) {
        this.signaturePad.penColor = this.color();
      }
    });
  }

  writeValue(value: PointGroup[]): void {
    this.contentValue = value || [];
    if (this.signaturePad) {
      this.signaturePad.fromData(value);
    }
  }

  registerOnTouched(fn: () => void): void {}

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (this.signaturePad) {
      isDisabled ? this.signaturePad.off() : this.signaturePad.on();
    }
  }

  registerOnChange(fn: (value: PointGroup[]) => void): void {
    this.propagateChange = fn;
  }

  // 存储画板的相关事件，在画布初始化后一一调用，组件销毁后一一销毁事件
  events: Array<{ eventName: string; callback: () => void }> = [
    { eventName: 'beginStroke', callback: () => console.log('绘画开始') },
    {
      eventName: 'endStroke',
      callback: () => {
        const data = this.signaturePad.toData();
        this.contentValue = data;
        this.onChange.emit(this.contentValue);
        this.propagateChange(this.contentValue);
      },
    },
  ];

  @HostListener('window:resize', ['$event'])
  resizeCanvas() {
    const canvas = this.canvasContainter().nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear();
  }

  initDraw() {
    const canvas = this.canvasContainter().nativeElement;

    this.signaturePad = new SignaturePad(canvas, {
      penColor: this.color(),
      backgroundColor: 'rgba(255, 255, 255, 0)',
    });

    // 执行画板的相关事件
    this.events.forEach(({ eventName, callback }) => {
      this.signaturePad.addEventListener(eventName, callback);
    });

    this.signaturePad.fromData(this.contentValue);
    this.isDisabled() ? this.signaturePad.off() : this.signaturePad.on();

  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initDraw();
    this.resizeCanvas();
  }

  ngOnDestroy() {
    this.events.forEach(({ eventName, callback }) => {
      this.signaturePad.removeEventListener(eventName, callback);
    });
  }
}
