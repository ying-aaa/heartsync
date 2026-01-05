import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    title: '用户管理',
    path: 'user',
    data: { icon: 'person' },
    loadComponent: () =>
      import('./system-user/system-user.component').then((m) => m.SystemUserComponent),
  },
  {
    title: '角色管理',
    path: 'role',
    data: { icon: 'supervisor_account' },
    loadComponent: () =>
      import('./system-role/role-manage.component').then((m) => m.SystemRoleComponent),
  },
  {
    title: '组织管理',
    path: 'department',
    data: { icon: 'business' },
    loadComponent: () =>
      import('./system-department/system-department.component').then(
        (m) => m.SystemOrganizationComponent,
      ),
  },
  {
    title: '文件服务',
    path: 'file',
    data: { icon: 'insert_drive_file' },
    loadComponent: () =>
      import('./system-file/system-file.component').then((m) => m.SystemFileComponent),
  },
  {
    title: '逻辑节点编辑器',
    path: 'node',
    data: { icon: 'device_hub' },
    loadComponent: () =>
      import('./node-editor/node-editor.component').then((m) => m.NodeEditorComponent),
  },
  {
    title: '数据管理',
    path: '',
    data: { icon: 'storage', expand: true },
    children: [
      {
        title: '字典管理',
        path: 'dict',
        data: { icon: 'book' },
        loadComponent: () =>
          import('./system-dict/system-dict.component').then((m) => m.SystemDictComponent),
      },
    ],
  },
] as Route[];
