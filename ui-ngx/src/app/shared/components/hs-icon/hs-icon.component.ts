// hs-icon.component.ts
import { Component, computed, input, OnInit, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // 若使用Material图标需导入
import { IIconConfig, IMatIconConfig, ICustomIconConfig, IIconType } from './hs-icon.model';
import { isMobile } from '@src/app/core/utils';
import { MatDialog } from '@angular/material/dialog';
import { HsIconSelectComponent } from '@src/app/modules/components/icon-select/icon-select.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'hs-icon',
  standalone: true,
  template: `
    @let config = parsedIconConfig();
    <div
      class="flex-center"
      [class]="isDesign() ? 'hover:bg-[var(--base-color-10)]! rounded-full' : ''"
      matTooltip="点击选择图标"
      matTooltipPosition="above"
      [matTooltipDisabled]="!isDesign()"
      [style.width]="config.bgSize + 'px'"
      [style.height]="config.bgSize + 'px'"
      [style.backgroundColor]="config.backgroundColor"
      (click)="isDesign() && openIconSelectDialog()"
    >
      @if (isCustomIcon(config)) {
        <img
          [src]="config.url"
          [style.width]="config.iconSize + 'px'"
          [style.height]="config.iconSize + 'px'"
          [style.backgroundColor]="config.backgroundColor"
          alt="custom-icon"
        />
      } @else {
        @let type = config.type === 'filled' ? '' : '-' + config.type;
        <mat-icon
          [fontSet]="'material-icons' + type"
          [style.color]="config.color"
          [style.fontSize]="config.iconSize + 'px'"
          [style.width]="config.iconSize + 'px'"
          [style.height]="config.iconSize + 'px'"
        >
          {{ config.name }}
        </mat-icon>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .hs-custom-icon {
        object-fit: contain;
      }
      .hs-mat-icon {
        vertical-align: middle;
      }
    `,
  ],
  imports: [MatIconModule, MatTooltipModule],
})
export class HsIconComponent implements OnInit {
  iconChange = output<string>();

  iconConfig = input<string | IIconConfig>('');
  isDesign = input<boolean>(true);
  width = input<string | number>('');
  height = input<string | number>('');

  parsedIconConfig = computed<IIconConfig>(() => {
    const rawConfig = this.iconConfig();

    if (!rawConfig) {
      return this.getDefaultMatIconConfig();
    }

    let resolvedConfig: IIconConfig;
    if (typeof rawConfig === 'string') {
      try {
        resolvedConfig = JSON.parse(rawConfig) as IIconConfig;
      } catch (error) {
        console.error('解析图标配置JSON失败:', error);
        return this.getDefaultMatIconConfig();
      }
    } else {
      resolvedConfig = rawConfig;
    }
    console.log('%c Line:86 🌰 resolvedConfig', 'color:#7f2b82', resolvedConfig);

    // 校验+补全配置（核心：强制size为xxxpx格式）
    return resolvedConfig;
  });

  constructor(private dialog: MatDialog) {}

  isCustomIcon(config: IIconConfig): config is ICustomIconConfig {
    return config.type === 'custom';
  }

  isMatIcon(config: IIconConfig): config is IMatIconConfig {
    const validTypes: IIconType[] = ['filled', 'outlined', 'round', 'sharp', 'two-tone'];
    return validTypes.includes(config.type as IIconType);
  }

  private getDefaultMatIconConfig(): IMatIconConfig {
    return {
      name: 'insert_drive_file',
      type: 'filled' as IIconType,
      color: '#000',
      iconSize: 24, // 规范xxxpx格式
      bgSize: 32,
      backgroundColor: 'transparent',
    };
  }

  openIconSelectDialog() {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(HsIconSelectComponent, {
      data: {},
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result: IIconConfig) => {
      if (result) {
        this.iconChange.emit(JSON.stringify(result));
      }
    });
  }

  ngOnInit() {}
}
