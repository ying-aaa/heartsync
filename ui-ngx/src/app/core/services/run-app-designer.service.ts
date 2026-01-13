import { Injectable, signal } from '@angular/core';

interface IAppConfigType {
  label: string;
  value: string;
}

@Injectable()
export class RunAppDesignService {
  // 'menuGlobal', 'menuSingle', 'appHeader'
  configTypes: IAppConfigType[] = [
    {
      label: '应用页面配置',
      value: 'appGlobal',
    },
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

  isDesigner = signal(false);

  selectedConfigType = signal<IAppConfigType>(this.configTypes[0]);

  constructor() {}

  setDesignMode(is: boolean) {
    this.isDesigner.set(is);
  }

  setConfigType(type: string) {
    if (!this.isDesigner()) return;
    const configType = this.configTypes.find((item) => item.value === type);
    configType && this.selectedConfigType.set(configType);
  }
}
