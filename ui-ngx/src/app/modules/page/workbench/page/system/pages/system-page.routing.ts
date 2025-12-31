import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    title: '用户管理',
    path: 'user',
    data: { icon: 'person' }, // 用户管理 -> person
    loadComponent: () =>
      import('./system-user/system-user.component').then((m) => m.SystemUserComponent),
  },
  {
    title: '角色管理',
    path: 'role',
    data: { icon: 'supervisor_account' }, // 角色管理 -> supervisor_account
    loadComponent: () =>
      import('./system-role/role-manage.component').then((m) => m.SystemRoleComponent),
  },
  {
    title: '组织管理',
    path: 'department',
    data: { icon: 'business' }, // 组织管理 -> business
    loadComponent: () =>
      import('./system-department/system-department.component').then(
        (m) => m.SystemOrganizationComponent,
      ),
  },
  {
    title: '逻辑节点编辑器',
    path: 'node',
    data: { icon: 'device_hub' }, // 逻辑节点编辑器 -> device_hub
    loadComponent: () =>
      import('./node-editor/node-editor.component').then((m) => m.NodeEditorComponent),
  },
  {
    title: '数据管理',
    path: '',
    data: { icon: 'storage', expand: true }, // 数据管理 -> storage
    children: [
      {
        title: '字典管理',
        path: 'dict',
        data: { icon: 'book' }, // 字典管理 -> book
        loadComponent: () =>
          import('./system-dict/system-dict.component').then((m) => m.SystemDictComponent),
      },
    ],
  },
] as Route[];
