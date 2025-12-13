import { Injectable, signal } from '@angular/core';

interface IAppConfigType {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppPageDesignService {
  // 'menuGlobal', 'menuSingle', 'appHeader'
  configTypes: IAppConfigType[] = [
    {
      label: '全局菜单配置',
      value: 'menuGlobal',
    },
    {
      label: '单例菜单配置',
      value: 'menuSingle',
    },
    {
      label: '应用头部配置',
      value: 'appHeader',
    },
  ];

  selectedConfigType = signal<IAppConfigType>(this.configTypes[2]);

  constructor() {}

  setConfigType(type: string) {
    this.selectedConfigType.set(this.configTypes.find((item) => item.value === type)!);
  }
}
