import { Component, computed, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MenuLiveComponent } from './menu-live/menu-live.component';
import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MenuDesignerService } from '../menu-deisgner.sevice';
import { MenuGlobalConfigComponent } from "./menu-global-config/menu-global-config.component";
import { MenuSingleConfigComponent } from "./menu-single-config/menu-single-config.component";

@Component({
  selector: 'hs-menu-designer',
  templateUrl: './menu-designer.component.html',
  imports: [
    MatIcon,
    MatDivider,
    MatButtonModule,
    MatFormField,
    MatSelectModule,
    MatInputModule,
    MenuLiveComponent,
    CdkDrag,
    CdkDropList,
    CdkDragPlaceholder,
    MenuGlobalConfigComponent,
    MenuSingleConfigComponent
],
})
export class MenuDesignerComponent implements OnInit {
  appId: string = getParamFromRoute('appId', this.route)!;

  presetComps = signal([
    {
      type: 'title',
      name: '基础菜单',
      icon: 'menu',
      comps: [
        {
          type: 'menu',
          name: '菜单项',
          icon: 'insert_drive_file',
          desc: '基础导航项',
        },
        {
          type: 'submenu',
          name: '子菜单',
          icon: 'folder',
          desc: '包含子项的菜单',
          children: [
            {
              type: 'menu',
              name: '菜单项',
              icon: 'insert_drive_file',
              desc: '基础导航项',
            },
          ],
        },
        {
          type: 'divider',
          name: '分割线',
          icon: 'horizontal_rule',
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
          type: 'search',
          name: '搜索框',
          icon: 'search',
          desc: '菜单内搜索功能',
        },
        {
          type: 'user',
          name: '用户信息',
          icon: 'face',
          desc: '显示用户资料',
        },
      ],
    },
  ]);

  menuData = signal<any>([]);

  onDrop() {
    this.menuData.set([...this.menuData()]);
  }

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

  constructor(
    private route: ActivatedRoute,
    private menuDeSignerService: MenuDesignerService,
  ) {}

  toggleDragging(isDragging: boolean): void {
    this.menuDeSignerService.toggleDragging(isDragging);
  }

  onDragStart(preset: any, group: any) {
    this.toggleDragging(true);

    const groupIndex = this.presetComps().findIndex((item: any) => item.name === group.name);
    const groupChildIndex = this.presetComps()[groupIndex].comps!.findIndex(
      (item: any) => item.name === preset.name,
    );

    // 创建一个临时占位元素
    const placeholder = { ...preset, isPlaceholder: true };

    this.presetComps.update((value: any) => {
      const newValue = [...value];
      newValue[groupIndex].comps.splice(groupChildIndex, 0, placeholder);
      return newValue;
    });
  }

  onDragEnd() {
    this.toggleDragging(false);

    this.presetComps.update((value: any) => {
      const newValue = [...value];

      newValue.forEach((group: any) => {
        group.comps = group.comps.filter((item: any) => !item.isPlaceholder);
      });

      return newValue;
    });
  }

  loadMenuData() {
    this.menuData.set([
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

    this.menuDeSignerService.selectNode(this.menuData()[0]);
  }

  ngOnInit() {
    this.loadMenuData();
  }
}
