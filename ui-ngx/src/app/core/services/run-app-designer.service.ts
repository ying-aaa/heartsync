import { Injectable, signal } from '@angular/core';

interface IAppConfigType {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class RunAppDesignService {
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
    {
      label: '应用页面配置',
      value: 'appContent',
    },
  ];

  isDesigner = signal(false);

  selectedConfigType = signal<IAppConfigType>(this.configTypes[2]);

  constructor() {}

  setDesignMode(is: boolean) {
    this.isDesigner.set(is);
  }

  setConfigType(type: string) {
    if (!this.isDesigner()) return;
    this.selectedConfigType.set(this.configTypes.find((item) => item.value === type)!);
  }
}
