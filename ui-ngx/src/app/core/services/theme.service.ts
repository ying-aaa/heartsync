import { Injectable, signal } from '@angular/core';
import { IThemeType } from '@src/app/shared/models/system.model';
import { LocalStorageService } from './local-storage.service';
import { isObject } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class HsThemeService {
  public currentTheme = signal<IThemeType | undefined>(undefined);
  public loadingState: boolean = false;

  public get isDark() {
    return this.currentTheme() === IThemeType.DARK;
  }

  constructor(private localStorageService: LocalStorageService) {
    this.toggleDarkTheme(
      this.localStorageService.getItem('theme') || IThemeType.LIGHT,
      true,
    );
  }

  public toggleDarkTheme(theme: IThemeType, isFirst: boolean = false) {
    if (this.currentTheme() === theme) return;
    const previousTheme = this.currentTheme() as IThemeType;
    this.currentTheme.set(theme);
    document.documentElement.classList.add(concatSuffix(theme));
    this.loadCss(`${concatSuffix(theme)}.css`, theme).then(
      (e) => {
        this.loadingState = false;
        if (!isFirst) {
          this.removeUnusedTheme(previousTheme);
          this.localStorageService.setItem('theme', this.currentTheme());
        }
      },
      (e) => {},
    );
  }

  private loadCss(href: string, id: string): Promise<Event> {
    this.loadingState = true;
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  private removeUnusedTheme(theme: IThemeType): void {
    document.documentElement.classList.remove(concatSuffix(theme));
    const removedThemeStyle = document.getElementById(theme);
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle);
    }
  }

  public getCurrentThemeConfig(
    themeConfig: any[] | { [key in IThemeType]: any },
  ): string {
    const themeConfigMap = new Map<IThemeType, any>();
    if (Array.isArray(themeConfig)) {
      const IThemeTypeArr = Object.values(IThemeType);
      themeConfig.forEach((config, index: number) => {
        themeConfigMap.set(IThemeTypeArr[index], config);
      });
    }
    if (isObject(themeConfigMap)) {
      Object.entries(themeConfig).forEach(([key, value]) => {
        themeConfigMap.set(key as IThemeType, value);
      });
    }
    return themeConfigMap.get(this.currentTheme()!);
  }

  public getBaseColor(opacity: number): string {
    return this.getCurrentThemeConfig([
      `rgba(0, 0, 0, .${opacity})`,
      `rgba(255, 255, 255, .${opacity})`,
    ]);
  }
}

function concatSuffix(name: string): string {
  return `${name}-theme`;
}
