// hs-icon-select.component.ts
import { Component, inject, signal, computed, output, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { HsThemeService } from '@src/app/core/services/theme.service';

// 图标类型定义
export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone';

// 图标数据接口
export interface IconData {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-hs-icon-select',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule, HsRadioComponent],
  templateUrl: './icon-select.component.html',
})
export class HsIconSelectComponent implements OnInit {
  // 使用 output() 函数创建输出属性
  iconSelected = output<{ name: string; color: string; type: IconType }>();

  // 图标类型配置 - 用于 HsRadioComponent
  iconTypes = signal([
    { label: '实心', value: 'filled' },
    { label: '轮廓', value: 'outlined' },
    { label: '圆角', value: 'round' },
    { label: '锐利', value: 'sharp' },
    { label: '双色', value: 'two-tone' },
  ]);

  // 预设颜色列表
  colors = signal([
    {
      value: this.themeService.getCurrentThemeConfig(['#000000', '#ffffff']),
      textColor: '#ffffff',
    },
    { value: '#3f51b5', textColor: '#ffffff' },
    { value: '#ff4081', textColor: '#ffffff' },
    { value: '#4caf50', textColor: '#ffffff' },
    { value: '#ff9800', textColor: '#000000' },
    { value: '#f44336', textColor: '#ffffff' },
    { value: '#9e9e9e', textColor: '#000000' },
    { value: '#1976d2', textColor: '#ffffff' },
    { value: '#9c27b0', textColor: '#ffffff' },
    { value: '#00bcd4', textColor: '#000000' },
    { value: '#795548', textColor: '#ffffff' },
    { value: '#607d8b', textColor: '#ffffff' },
  ]);

  // 不同类型的图标列表（避免切换时的卡顿）
  filledIcons = signal<IconData[]>([]);
  outlinedIcons = signal<IconData[]>([]);
  roundIcons = signal<IconData[]>([]);
  sharpIcons = signal<IconData[]>([]);
  twoToneIcons = signal<IconData[]>([]);

  // 当前选中的图标
  selectedIcon = signal<string | null>('home');

  // 当前选中的颜色
  selectedColor = signal<string>(this.themeService.getCurrentThemeConfig(['#000000', '#ffffff']));

  // 当前选中的图标类型
  selectedIconType = signal<IconType>('filled');

  // 当前显示自定义页面
  showCustomPage = signal<boolean>(false);

  // 当前显示的图标列表（根据类型动态切换）
  currentIconList = computed(() => {
    const type = this.selectedIconType();
    switch (type) {
      case 'filled':
        return this.filledIcons();
      case 'outlined':
        return this.outlinedIcons();
      case 'round':
        return this.roundIcons();
      case 'sharp':
        return this.sharpIcons();
      case 'two-tone':
        return this.twoToneIcons();
      default:
        return this.filledIcons();
    }
  });

  // 计算属性：获取当前图标字体集
  currentFontSet = computed(() => {
    const type = this.selectedIconType();
    switch (type) {
      case 'filled':
        return 'material-icons';
      case 'outlined':
        return 'material-icons-outlined';
      case 'round':
        return 'material-icons-round';
      case 'sharp':
        return 'material-icons-sharp';
      case 'two-tone':
        return 'material-icons-two-tone';
      default:
        return 'material-icons';
    }
  });

  constructor(private themeService: HsThemeService) {}

  ngOnInit(): void {
    // 初始化所有类型的图标列表（相同的图标，不同的类型）
    const commonIcons = this.generateCommonIcons();
    this.filledIcons.set(commonIcons);
    this.outlinedIcons.set(this.cloneIcons(commonIcons));
    this.roundIcons.set(this.cloneIcons(commonIcons));
    this.sharpIcons.set(this.cloneIcons(commonIcons));
    this.twoToneIcons.set(this.cloneIcons(commonIcons));
  }

  // 生成常用图标
  private generateCommonIcons(): IconData[] {
    return [
      { name: 'home', selected: true },
      { name: 'search', selected: false },
      { name: 'settings', selected: false },
      { name: 'person', selected: false },
      { name: 'notifications', selected: false },
      { name: 'favorite', selected: false },
      { name: 'star', selected: false },
      { name: 'check', selected: false },
      { name: 'close', selected: false },
      { name: 'menu', selected: false },
      { name: 'arrow_back', selected: false },
      { name: 'arrow_forward', selected: false },
      { name: 'add', selected: false },
      { name: 'delete', selected: false },
      { name: 'edit', selected: false },
      { name: 'save', selected: false },
      { name: 'cancel', selected: false },
      { name: 'refresh', selected: false },
      { name: 'download', selected: false },
      { name: 'upload', selected: false },
      { name: 'email', selected: false },
      { name: 'phone', selected: false },
      { name: 'location_on', selected: false },
      { name: 'schedule', selected: false },
      { name: 'visibility', selected: false },
      { name: 'visibility_off', selected: false },
      { name: 'lock', selected: false },
      { name: 'lock_open', selected: false },
      { name: 'info', selected: false },
      { name: 'warning', selected: false },
      { name: 'error', selected: false },
      { name: 'help', selected: false },
      { name: 'dashboard', selected: false },
      { name: 'shopping_cart', selected: false },
      { name: 'payment', selected: false },
      { name: 'attach_file', selected: false },
      { name: 'image', selected: false },
      { name: 'music_note', selected: false },
      { name: 'play_arrow', selected: false },
      { name: 'pause', selected: false },
      { name: 'stop', selected: false },
      { name: 'skip_next', selected: false },
      { name: 'skip_previous', selected: false },
      { name: 'volume_up', selected: false },
      { name: 'share', selected: false },
      { name: 'print', selected: false },
      { name: 'filter_list', selected: false },
      { name: 'sort', selected: false },
      { name: 'keyboard_arrow_up', selected: false },
      { name: 'keyboard_arrow_down', selected: false },
    ];
  }

  // 克隆图标列表（重置选中状态）
  private cloneIcons(icons: IconData[]): IconData[] {
    return icons.map((icon) => ({ ...icon, selected: false }));
  }

  // 选择图标
  selectIcon(iconName: string): void {
    // 重置当前类型所有图标的选中状态
    const type = this.selectedIconType();
    const updateFn = (icons: IconData[]) =>
      icons.map((icon) => ({
        ...icon,
        selected: icon.name === iconName,
      }));

    switch (type) {
      case 'filled':
        this.filledIcons.update(updateFn);
        break;
      case 'outlined':
        this.outlinedIcons.update(updateFn);
        break;
      case 'round':
        this.roundIcons.update(updateFn);
        break;
      case 'sharp':
        this.sharpIcons.update(updateFn);
        break;
      case 'two-tone':
        this.twoToneIcons.update(updateFn);
        break;
    }

    this.selectedIcon.set(iconName);
  }

  // 选择颜色
  selectColor(event: string | Event): void {
    if (typeof event === 'string') {
      this.selectedColor.set(event);
      return;
    }
    const color = (event.target as HTMLInputElement).value;
    this.selectedColor.set(color);
  }

  // 切换到自定义图标页面
  goToCustomPage(): void {
    this.showCustomPage.set(true);
  }

  // 返回图标选择页面
  backToIconSelect(): void {
    this.showCustomPage.set(false);
  }

  // 加载所有图标（示例方法）
  loadAllIcons(): void {
    // 这里可以添加加载所有图标的逻辑
    console.log('加载所有图标...');

    // 示例：模拟加载更多图标
    const additionalIcons = [
      { name: 'add_circle', selected: false },
      { name: 'arrow_drop_down', selected: false },
      { name: 'arrow_drop_up', selected: false },
      { name: 'build', selected: false },
      { name: 'call', selected: false },
      { name: 'chat', selected: false },
      { name: 'code', selected: false },
      { name: 'computer', selected: false },
      { name: 'done', selected: false },
      { name: 'event', selected: false },
    ];

    // 添加到每种类型的图标列表中
    this.filledIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.outlinedIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.roundIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.sharpIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.twoToneIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
  }

  // 提交选择
  submit(): void {
    if (this.selectedIcon()) {
      this.iconSelected.emit({
        name: this.selectedIcon()!,
        color: this.selectedColor(),
        type: this.selectedIconType(),
      });
    }

    // 关闭弹窗
    const dialogRef = inject(MatDialogRef<HsIconSelectComponent>, { optional: true });
    if (dialogRef) {
      dialogRef.close({
        name: this.selectedIcon(),
        color: this.selectedColor(),
        type: this.selectedIconType(),
      });
    }
  }
}
