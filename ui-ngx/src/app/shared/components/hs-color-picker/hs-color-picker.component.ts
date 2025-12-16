import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  forwardRef,
  ComponentRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Overlay, OverlayModule, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { SketchComponent } from 'ngx-color/sketch';
import { Subject, takeUntil } from 'rxjs';
import { Color } from 'ngx-color';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'hs-color-picker',
  templateUrl: './hs-color-picker.component.html',
  styleUrls: ['./hs-color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HsColorPickerComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => HsColorPickerComponent),
    },
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    OverlayModule,
    PortalModule,
    ReactiveFormsModule,
  ],
})
export class HsColorPickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  // 输入参数
  @Input() format: any = 'hex';
  @Input() value: string = '';
  @Input() defaultValue: string = '#ffffff';
  @Input() allowClear: boolean = false;
  @Input() open: boolean = false;
  @Input() disabledAlpha: boolean = false;
  @Input() title: string = '选择颜色';
  @Input() displayType: 'block' | 'input' | 'readonly' = 'block';

  @Input() disabled = false; // 关键！添加这行

  // 输出事件
  @Output() onChange = new EventEmitter<string>();
  @Output() onClear = new EventEmitter<void>();
  @Output() onFormatChange = new EventEmitter<any>();
  @Output() onOpenChange = new EventEmitter<boolean>();

  // 模板引用
  @ViewChild('colorBlock', { static: false }) colorBlock!: ElementRef<HTMLElement>;
  @ViewChild('colorInput', { static: false }) colorInput!: ElementRef<HTMLInputElement>;

  // 内部状态
  // disabled = false;
  private overlayRef!: OverlayRef;
  private destroy$ = new Subject<void>();
  private onChangeCallback: (value: string) => void = () => {};
  onTouchedCallback: () => void = () => {};

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    // 初始化默认值
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
    // 初始化弹窗状态
    if (this.open) this.openColorPicker();

    if (this.disabled) this.closeColorPicker();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.closeColorPicker();
  }

  // ===== ControlValueAccessor 实现 =====
  writeValue(value: string): void {
    if (value !== this.value) {
      this.value = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) this.closeColorPicker();
  }

  // ===== 弹窗控制 =====
  openColorPicker(): void {
    if (this.disabled) return;

    // 创建弹窗位置策略
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.colorBlock.nativeElement)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ])
      .withPush(true)
      .withViewportMargin(8);

    // 创建弹窗实例
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'hs-color-picker-overlay',
    });

    // 挂载颜色选择器组件
    const pickerPortal = new ComponentPortal(SketchComponent);
    // 声明类型
    const pickerRef: ComponentRef<SketchComponent> = this.overlayRef.attach(pickerPortal);
    // 初始化颜色选择器配置
    pickerRef.instance.color = this.value || this.defaultValue;
    pickerRef.instance.disableAlpha = this.disabledAlpha;

    // // 监听颜色变化
    pickerRef.instance.onChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ color }: { color: Color }) => {
        this.handleColorChange(color);
      });

    // 点击遮罩关闭弹窗
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeColorPicker();
      });

    this.overlayRef
      .keydownEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        // 捕获回车键（Enter）
        if (event.key === 'Enter' || event.keyCode === 13) {
          event.preventDefault(); // 阻止默认行为（如表单提交）
          // 1. 获取当前picker的颜色并确认
          const { hex, rgb, hsl, hsv, oldHue, source, color } = pickerRef.instance;
          if (color) {
            this.handleColorChange({ hex, rgb, hsl, hsv, oldHue, source });
          }
          // 2. 关闭颜色面板
          this.closeColorPicker();
        }
        // 可选：监听ESC键关闭面板（增强体验）
        else if (event.key === 'Escape' || event.keyCode === 27) {
          this.closeColorPicker();
        }
      });

    this.open = true;
    this.onOpenChange.emit(true);
    this.onTouchedCallback();
  }

  closeColorPicker(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
    this.open = false;
    this.onOpenChange.emit(false);
  }

  // ===== 颜色处理 =====
  private handleColorChange(color: Color): void {
    // 根据格式和透明度处理颜色值
    switch (this.format) {
      case 'rgb':
        this.value = this.disabledAlpha
          ? `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
          : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        break;
      case 'hsl':
        this.value = this.disabledAlpha
          ? `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
          : `hsla(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%, ${color.hsl.a})`;
        break;
      default:
        this.value = this.disabledAlpha
          ? color.hex
          : `${color.hex}${Math.round(color.rgb.a * 255)
              .toString(16)
              .padStart(2, '0')}`;
        break;
    }

    this.onChange.emit(this.value);
    this.onChangeCallback(this.value);
  }

  // 清除颜色
  clearColor(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled || !this.allowClear) return;

    this.value = '';
    this.onChange.emit('');
    this.onChangeCallback('');
    this.onClear.emit();
    this.onTouchedCallback();
  }

  // 输入框值变化
  onInputChange(event: Event): void {
    if (this.disabled) return;
    const inputValue = (event.target as HTMLInputElement).value;

    this.value = inputValue;
    this.onChange.emit(inputValue);
    this.onChangeCallback(inputValue);
    this.onTouchedCallback();
  }

  // 触发弹窗开关
  onClickTrigger(): void {
    if (this.disabled) return;
    this.open ? this.closeColorPicker() : this.openColorPicker();
  }
}
