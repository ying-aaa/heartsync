import { Component } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

interface DepartmentNode {
  name: string;
  manager: string;
  budget: string;
  employees: number;
  status: string;
  children?: DepartmentNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  manager: string;
  budget: string;
  employees: number;
  status: string;
  level: number;
}

@Component({
  selector: 'hs-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.less'],
  imports: [CommonModule,MatTableModule, MatButtonModule, MatIconModule],

})
export class MenuManagementComponent  {
  displayedColumns: string[] = ['name', 'manager', 'budget', 'employees', 'status', 'actions'];
  
  private _transformer = (node: DepartmentNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      manager: node.manager,
      budget: node.budget,
      employees: node.employees,
      status: node.status,
      level: level,
    };
  };

   
  // treeControl = new NestedTreeControl<DepartmentNode>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<DepartmentNode>();

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  toggleRow(node: ExampleFlatNode) {
    this.treeControl.toggle(node);
  }

  constructor() {
    this.dataSource.data = [
      {
        name: '工程部',
        manager: '张明',
        budget: '$1,200,000',
        employees: 85,
        status: 'active',
        children: [
          {
            name: '前端开发',
            manager: '李华',
            budget: '$450,000',
            employees: 25,
            status: 'active',
            children: [
              {
                name: 'UI/UX设计',
                manager: '王芳',
                budget: '$120,000',
                employees: 8,
                status: 'active',
                children: []
              },
              {
                name: 'Web应用开发',
                manager: '陈伟',
                budget: '$330,000',
                employees: 17,
                status: 'active',
                children: []
              }
            ]
          },
          {
            name: '后端开发',
            manager: '刘强',
            budget: '$750,000',
            employees: 60,
            status: 'active',
            children: [
              {
                name: 'API服务',
                manager: '赵静',
                budget: '$300,000',
                employees: 20,
                status: 'active',
                children: []
              },
              {
                name: '数据库管理',
                manager: '杨帆',
                budget: '$200,000',
                employees: 15,
                status: 'active',
                children: []
              },
              {
                name: '基础设施',
                manager: '周涛',
                budget: '$250,000',
                employees: 25,
                status: 'warning',
                children: []
              }
            ]
          }
        ]
      },
      {
        name: '市场部',
        manager: '林薇',
        budget: '$850,000',
        employees: 45,
        status: 'active',
        children: [
          {
            name: '数字营销',
            manager: '郑浩',
            budget: '$350,000',
            employees: 18,
            status: 'active',
            children: []
          },
          {
            name: '品牌管理',
            manager: '吴琳',
            budget: '$250,000',
            employees: 12,
            status: 'active',
            children: []
          },
          {
            name: '市场研究',
            manager: '钱鑫',
            budget: '$250,000',
            employees: 15,
            status: 'inactive',
            children: []
          }
        ]
      },
      {
        name: '人力资源',
        manager: '孙莉',
        budget: '$600,000',
        employees: 12,
        status: 'active',
        children: [
          {
            name: '招聘',
            manager: '周凯',
            budget: '$200,000',
            employees: 5,
            status: 'active',
            children: []
          },
          {
            name: '培训与发展',
            manager: '黄婷',
            budget: '$150,000',
            employees: 4,
            status: 'active',
            children: []
          },
          {
            name: '薪酬福利',
            manager: '朱明',
            budget: '$250,000',
            employees: 3,
            status: 'warning',
            children: []
          }
        ]
      }
    ];
  }


  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'warning': return 'status-warning';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return '运行中';
      case 'inactive': return '已停用';
      case 'warning': return '需关注';
      default: return '';
    }
  }
}