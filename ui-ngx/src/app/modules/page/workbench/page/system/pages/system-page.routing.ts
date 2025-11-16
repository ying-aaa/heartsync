import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    title: '用户管理',
    path: 'user',
    data: { icon: 'user', activeIcon: 'user' },
    loadComponent: () =>
      import('./system-user/system-user.component').then((m) => m.SystemUserComponent),
  },
  {
    title: '角色管理',
    path: 'role',
    data: { icon: 'role' },
    loadComponent: () =>
      import('./system-role/role-manage.component').then((m) => m.SystemRoleComponent),
    children: [
      {
        title: '角色列表',
        path: '',
        loadComponent: () =>
          import('./system-role/role-list/role-list.component').then((m) => m.RoleListComponent),
      },
      {
        title: '角色详情',
        path: ':roleId/detail',
        loadComponent: () =>
          import('./system-role/role-detail/role-detail.component').then(
            (m) => m.RoleDetailComponent,
          ),
      },
    ],
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
    title: '逻辑节点编辑器',
    path: 'node',
    data: { icon: 'node' },
    loadComponent: () =>
      import('./node-editor/node-editor.component').then((m) => m.NodeEditorComponent),
  },
  {
    title: '数据管理',
    path: '',
    data: { icon: 'datasource', expand: true },
    children: [
      {
        title: '字典管理',
        path: 'dict',
        data: { icon: 'dict' },
        loadComponent: () =>
          import('./system-dict/system-dict.component').then((m) => m.SystemDictComponent),
      },
    ],
  },
] as Route[];
