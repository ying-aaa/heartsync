// hs-icon-select.component.ts
import {
  Component,
  inject,
  signal,
  computed,
  output,
  OnInit,
  input,
  effect,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  IMatIconType,
  IMatIconConfig,
  IIconType,
} from '@src/app/shared/components/hs-icon/hs-icon.model';

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
  iconContext = input<IIconConfig | null>(null);

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

  filledIcons = signal<string[]>([]);
  outlinedIcons = signal<string[]>([]);
  roundIcons = signal<string[]>([]);
  sharpIcons = signal<string[]>([]);
  twoToneIcons = signal<string[]>([]);

  selectedIcon = signal<string | null>('home');

  selectedColor = signal<string>(this.themeService.getCurrentThemeConfig(['#000000', '#ffffff']));

  iconConfig = new FormGroup({
    iconSize: new FormControl(24),
    bgSize: new FormControl(32),
    backgroundColor: new FormControl('transparent'),
  });

  selectedMatIconType = signal<IMatIconType>('filled');

  iconType = signal<IIconType>('mat-icon');

  currentIconList = computed(() => {
    const type = this.selectedMatIconType();
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
    const type = this.selectedMatIconType();
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
    @Inject(MAT_DIALOG_DATA) public data: { iconContext: IIconConfig | null },
  ) {
    this.iconConfig.valueChanges.subscribe(({ iconSize, bgSize }) => {
      if (iconSize! > bgSize!) {
        this.iconConfig.patchValue({
          bgSize: iconSize,
        });
      }
    });

    this.fillIconContext(this.data.iconContext);

    effect(() => {
      let iconContext = this.iconContext();
      this.fillIconContext(iconContext);
    });
  }

  fillIconContext(iconContext: IIconConfig | null) {
    if (!iconContext) return;
    const iconType = iconContext.type;
    if (!iconType) return;
    if (iconType === 'mat-icon') {
      iconContext = iconContext as IMatIconConfig;
      this.selectedMatIconType.set(iconContext.matIconType);
      this.selectedIcon.set(iconContext.name);
      this.selectedColor.set(iconContext.color);
    } else {
      // 自定义图标
    }
    this.iconType.set(iconType);
    this.iconConfig.patchValue({
      iconSize: iconContext.iconSize,
      bgSize: iconContext.bgSize,
      backgroundColor: iconContext.backgroundColor,
    });
  }

  ngOnInit(): void {
    const commonIcons = this.generateCommonIcons();
    this.filledIcons.set(commonIcons);
    this.outlinedIcons.set(commonIcons);
    this.roundIcons.set(commonIcons);
    this.sharpIcons.set(commonIcons);
    this.twoToneIcons.set(commonIcons);
  }

  private generateCommonIcons(): string[] {
    const iconNames = [
      'home',
      'search',
      'settings',
      'person',
      'notifications',
      'favorite',
      'star',
      'check',
      'close',
      'menu',
      'arrow_back',
      'arrow_forward',
      'add',
      'delete',
      'edit',
      'save',
      'cancel',
      'refresh',
      'download',
      'upload',
      'email',
      'phone',
      'location_on',
      'schedule',
      'visibility',
      'visibility_off',
      'lock',
      'lock_open',
      'info',
      'warning',
      'error',
      'help',
      'dashboard',
      'shopping_cart',
      'payment',
      'attach_file',
      'image',
      'music_note',
      'play_arrow',
      'pause',
      'stop',
      'skip_next',
      'skip_previous',
      'volume_up',
      'share',
      'print',
      'filter_list',
      'sort',
      'keyboard_arrow_up',
      'keyboard_arrow_down',
    ];

    return iconNames;
  }

  selectIcon(iconName: string): void {
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
    this.iconType.set('custom');
  }

  backToIconSelect(): void {
    this.iconType.set('mat-icon');
  }

  loadAllIcons(): void {
    console.log('加载所有图标...');
  }

  submit(): void {
    const iconType = this.iconType();
    const iconConfig = (() => {
      if (iconType === 'mat-icon') {
        return {
          type: iconType,
          name: this.selectedIcon(),
          matIconType: this.selectedMatIconType(),
          color: this.selectedColor(),
          ...this.iconConfig.value,
        } as IMatIconConfig;
      } else if (iconType === 'custom') {
        return {
          type: iconType,
          url: this.selectedIcon(),
          ...this.iconConfig.value,
        } as ICustomIconConfig;
      }
      return {} as IIconConfig;
    })();
    this.iconSelected.emit(iconConfig);
    if (this.dialogRef) {
      this.dialogRef.close(iconConfig);
    }
  }
}
