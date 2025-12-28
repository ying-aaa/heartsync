import { Component, computed, input, OnInit, signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'hs-role-permission',
  templateUrl: './role-permission.component.html',
  imports: [MatCheckbox, NgScrollbarModule],
})
export class RolePermissionComponent implements OnInit {
  roleId = input.required<string | null>();

  sectionList = signal<any[]>([
    {
      name: '系统主页',
      key: 'system-page',
      optional: false,
      level: 0,
    },
    {
      name: '应用管理',
      key: 'app-manage',
      optional: true,
      level: 1,
    },
    {
      name: '可编辑',
      key: 'app-manage:edit',
      optional: true,
      level: 2,
    },
    {
      name: '可查看',
      key: 'app-manage:view',
      optional: true,
      level: 2,
    },
    {
      name: '系统主页',
      key: 'system-page',
      optional: false,
      level: 0,
    },
    {
      name: '应用管理',
      key: 'app-manage',
      optional: true,
      level: 1,
    },
    {
      name: '可编辑',
      key: 'app-manage:edit',
      optional: true,
      level: 2,
    },
    {
      name: '可查看',
      key: 'app-manage:view',
      optional: true,
      level: 2,
    },
    {
      name: '应用管理',
      key: 'app-manage',
      optional: true,
      level: 1,
    },
    {
      name: '可编辑',
      key: 'app-manage:edit',
      optional: true,
      level: 2,
    },
    {
      name: '可查看',
      key: 'app-manage:view',
      optional: true,
      level: 2,
    },
  ]);

  sectionGroup = computed(() => {
    const sectionList = this.sectionList();
    return sectionList.reduce((acc, cur) => {
      if (cur.level == 0) {
        acc.push([cur]);
      } else {
        acc.at(-1).push(cur);
      }
      return acc;
    }, []);
  });

  constructor() {}

  ngOnInit() {}
}
