// hs-icon-select.component.ts
import { Component, inject, signal, computed, output, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ICustomIconConfig,
  IIconConfig,
  IIconType,
  IMatIconConfig,
} from '@src/app/shared/components/hs-icon/hs-icon.model';

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
  templateUrl: './icon-select.component.html',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    HsRadioComponent,
    MatInputModule,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HsIconSelectComponent implements OnInit {
  iconSelected = output<IIconConfig>();

  iconTypes = signal([
    { label: '实心', value: 'filled' },
    { label: '轮廓', value: 'outlined' },
    { label: '圆角', value: 'round' },
    { label: '锐利', value: 'sharp' },
    { label: '双色', value: 'two-tone' },
  ]);

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

  filledIcons = signal<IconData[]>([]);
  outlinedIcons = signal<IconData[]>([]);
  roundIcons = signal<IconData[]>([]);
  sharpIcons = signal<IconData[]>([]);
  twoToneIcons = signal<IconData[]>([]);

  selectedIcon = signal<string | null>('home');

  selectedColor = signal<string>(this.themeService.getCurrentThemeConfig(['#000000', '#ffffff']));

  iconConfig = new FormGroup({
    iconSize: new FormControl(24),
    bgSize: new FormControl(32),
    backgroundColor: new FormControl('transparent'),
  });

  selectedIconType = signal<IIconType>('filled');

  showCustomPage = signal<boolean>(false);

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

  constructor(
    private themeService: HsThemeService,
    private dialogRef: MatDialogRef<HsIconSelectComponent>,
  ) {
    this.iconConfig.valueChanges.subscribe(({ iconSize, bgSize }) => {
      if (iconSize! > bgSize!) {
        this.iconConfig.patchValue({
          bgSize: iconSize,
        });
      }
    });
  }

  ngOnInit(): void {
    const commonIcons = this.generateCommonIcons();
    this.filledIcons.set(commonIcons);
    this.outlinedIcons.set(this.cloneIcons(commonIcons));
    this.roundIcons.set(this.cloneIcons(commonIcons));
    this.sharpIcons.set(this.cloneIcons(commonIcons));
    this.twoToneIcons.set(this.cloneIcons(commonIcons));
  }

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

  private cloneIcons(icons: IconData[]): IconData[] {
    return icons.map((icon) => ({ ...icon, selected: false }));
  }

  selectIcon(iconName: string): void {
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

  selectColor(event: string | Event): void {
    if (typeof event === 'string') {
      this.selectedColor.set(event);
      return;
    }
    const color = (event.target as HTMLInputElement).value;
    this.selectedColor.set(color);
  }

  goToCustomPage(): void {
    this.showCustomPage.set(true);
  }

  backToIconSelect(): void {
    this.showCustomPage.set(false);
  }

  loadAllIcons(): void {
    console.log('加载所有图标...');

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

    this.filledIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.outlinedIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.roundIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.sharpIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
    this.twoToneIcons.update((icons) => [...icons, ...this.cloneIcons(additionalIcons)]);
  }

  submit(): void {
    const showCustomPage = this.showCustomPage();
    const iconConfig = (() => {
      if (!showCustomPage) {
        return {
          name: this.selectedIcon(),
          type: this.selectedIconType(),
          color: this.selectedColor(),
          ...this.iconConfig.value,
        } as IMatIconConfig;
      } else {
        return {
          url: this.selectedIcon(),
          ...this.iconConfig.value,
        } as ICustomIconConfig;
      }
    })();
    this.iconSelected.emit(iconConfig);
    if (this.dialogRef) {
      this.dialogRef.close(iconConfig);
    }
  }
}
