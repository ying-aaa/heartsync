import { Routes } from '@angular/router';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

export default [
  {
    title: '应用配置',
    path: '',
    providers: [RunAppMenuService, RunAppDesignService, RunAppGlobalService],
    loadComponent: () =>
      import('./app/app-design-manage/app-design-manage.component').then(
        (m) => m.AppDesignManageComponent,
      ),
  },
] as Routes;
