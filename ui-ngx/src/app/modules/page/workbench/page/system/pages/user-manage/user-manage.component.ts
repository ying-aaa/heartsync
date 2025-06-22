import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeSelectComponent } from '@shared/components/hs-tree-select/hs-tree-select.component';

@Component({
  selector: 'hs-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.less'],
  imports: [TreeSelectComponent, FormsModule, CommonModule],
})
export class UserManageComponent implements OnInit {
  value = [1, 11];

  departmentTree: any[] = [
    {
      id: 1,
      name: '公司总部',
      children: [
        { id: 11, name: '总裁办' },
        { id: 12, name: '董事会' },
        {
          id: 13,
          name: '公司总部',
          children: [
            { id: 131, name: '总裁办' },
            { id: 132, name: '董事会' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '技术部',
      expanded: true,
      children: [
        { id: 21, name: '后端组' },
        { id: 22, name: '前端组' },
        { id: 23, name: '测试组' },
      ],
    },
    {
      id: 3,
      name: '市场部',
      children: [
        { id: 31, name: '国内营销' },
        { id: 32, name: '国际营销' },
      ],
    },
    {
      id: 4,
      name: '人力资源部',
      disabled: true,
    },
  ];

  asyncTree: any[] = [
    {
      id: 'china',
      name: '中国',
      hasChildren: true,
    },
    {
      id: 'usa',
      name: '美国',
      hasChildren: true,
    },
  ];

  onSelectionChange(nodes: any[]) {
    console.log('选择变更:', nodes);
  }

  loadChildren(node: any): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let children: any[] | PromiseLike<any[]> = [];
        if (node.id === 'china') {
          children = [
            { id: 'beijing', name: '北京', hasChildren: true },
            { id: 'shanghai', name: '上海', hasChildren: true },
            { id: 'guangdong', name: '广东', hasChildren: true },
          ];
        } else if (node.id === 'usa') {
          children = [
            { id: 'newyork', name: '纽约', hasChildren: true },
            { id: 'california', name: '加利福尼亚', hasChildren: true },
          ];
        } else if (node.id === 'beijing') {
          children = [
            { id: 'chaoyang', name: '朝阳区' },
            { id: 'haidian', name: '海淀区' },
          ];
        }
        resolve(children);
      }, 1000);
    });
  }
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      // this.is = false;
    }, 2000);
  }
}
