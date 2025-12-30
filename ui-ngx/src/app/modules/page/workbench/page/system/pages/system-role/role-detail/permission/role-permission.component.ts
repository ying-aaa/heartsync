import { Component, computed, input, OnInit, signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { isUndefined } from '@src/app/core/utils';
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

  isUndefined = isUndefined;

  toggleNode(node: any, isExpand: boolean) {
    if (isExpand) {
      const currentexpanded = node.expanded || isUndefined(node.expanded);
      node.expanded = !currentexpanded;

      const index = this.sectionList().findIndex((item) => item === node);
      const level = node.level;
      // 获取下一个节点level为0的索引
      let nextIndex = this.sectionList().findIndex(
        (item, idx, arr) =>
          // 同级或下级，后面的元素，下个等级不等于当前等级
          item.level <= level && idx > index && arr[index + 1]?.level !== item.level,
      );
      nextIndex = nextIndex === -1 ? this.sectionList().length : nextIndex;
      this.sectionList.update((list) => {
        list.forEach((item, idx) => {
          if (idx > index && idx < nextIndex) {
            item.display = currentexpanded ? 'none' : 'flex';
            item.expanded = !currentexpanded;
          }
        });
        return list;
      });
    }
  }

  ngOnInit() {}
}
