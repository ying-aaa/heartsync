import { Component, computed, OnInit, signal } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { RunAppComponent } from '@src/app/modules/page/run-app/run-app.component';
import { MatFormField, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MenuLiveComponent } from './menu-tree/menu-live.component';

@Component({
  selector: 'hs-menu-designer',
  templateUrl: './menu-designer.component.html',
  imports: [
    MatIcon,
    MatDivider,
    MatButtonModule,
    RunAppComponent,
    MatFormField,
    MatSelectModule,
    MatInputModule,
    MenuLiveComponent,
  ],
})
export class MenuDesignerComponent implements OnInit {
  appId: string = getParamFromRoute('appId', this.route)!;

  presetComps = [
    {
      type: 'title',
      name: '基础菜单',
      icon: 'menu',
      comps: [
        {
          type: 'comp',
          name: '菜单项',
          icon: 'insert_drive_file',
          key: 'menu',
          desc: '基础导航项',
        },
        {
          type: 'comp',
          name: '子菜单',
          icon: 'folder',
          key: 'submenu',
          desc: '包含子项的菜单',
        },
        {
          type: 'comp',
          name: '分割线',
          icon: 'horizontal_rule',
          key: 'divider',
          desc: '分隔不同菜单项',
        },
      ],
    },
    {
      type: 'title',
      name: '高级组件',
      icon: 'menu',
      comps: [
        {
          type: 'comp',
          name: '搜索框',
          icon: 'search',
          key: 'search',
          desc: '菜单内搜索功能',
        },
        {
          type: 'comp',
          name: '用户信息',
          icon: 'face',
          key: 'user',
          desc: '显示用户资料',
        },
      ],
    },
  ];

  menuData = signal<any>([
    {
      id: '1',
      name: '仪表板',
      type: 'parent',
      children: [
        {
          id: '1-1',
          name: '首页大屏',
          type: 'child',
          children: [
            {
              id: '1-1-1',
              name: '风机大屏',
              type: 'child',
            },
            {
              id: '1-1-2',
              name: '火电大屏',
              type: 'child',
            },
          ],
        },
        {
          id: '1-2',
          name: '燃油机状态',
          type: 'child',
        },
      ],
    },
    {
      id: '2',
      name: '内容管理',
      type: 'parent',
      children: [
        {
          id: '2-1',
          name: '文章列表',
          type: 'child',
          children: [],
        },
        {
          id: '2-2',
          name: '图片库',
          type: 'child',
        },
      ],
    },
  ]);
  connectedTo = computed(() => {
    function traverse(nodes: any = [], ids: string[] = ['scope']) {
      nodes.forEach((node: any) => {
        ids.unshift(node.id);
        if (node.children) {
          traverse(node.children, ids);
        }
      });
      return ids;
    }
    return traverse(this.menuData());
  });
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}
}
