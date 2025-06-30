import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    title: '用户管理',
    path: 'user',
    data: { icon: 'user' },
    loadComponent: () =>
      import('./system-user/system-user.component').then(
        (m) => m.SystemUserComponent,
      ),
  },
  {
    title: '角色管理',
    path: 'role',
    data: { icon: 'role' },
    loadComponent: () =>
      import('./system-role/system-role.component').then(
        (m) => m.SystemRoleComponent,
      ),
  },
  {
    title: '组织管理',
    path: 'department',
    data: { icon: 'department' },
    loadComponent: () =>
      import('./system-department/system-department.component').then(
        (m) => m.SystemOrganizationComponent,
      ),
  },
  {
    title: '数据管理',
    path: '',
    data: { icon: 'datasource' },
    children: [
      {
        title: '字典管理',
        path: 'dict',
        data: { icon: 'dict' },
        loadComponent: () =>
          import('./system-dict/system-dict.component').then(
            (m) => m.SystemDictComponent,
          ),
      },
    ],
  },
] as Route[];
