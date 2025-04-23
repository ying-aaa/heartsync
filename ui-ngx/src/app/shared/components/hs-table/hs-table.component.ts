import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'; // 导入 ngx-datatable 模块
import { NgScrollbarModule } from 'ngx-scrollbar';


export interface PeriodicElement {
  appName: string;
  description: string;
  createTime: string;
  status: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    "appName": "办公助手",
    "description": "提高工作效率的办公软件。",
    "createTime": "2024-06-01T12:30:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "健康追踪器",
    "description": "记录和分析您的日常健康数据。",
    "createTime": "2024-06-02T12:45:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "办公助手",
    "description": "提高工作效率的办公软件。",
    "createTime": "2024-06-01T12:30:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "健康追踪器",
    "description": "记录和分析您的日常健康数据。",
    "createTime": "2024-06-02T12:45:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "办公助手",
    "description": "提高工作效率的办公软件。",
    "createTime": "2024-06-01T12:30:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "健康追踪器",
    "description": "记录和分析您的日常健康数据。",
    "createTime": "2024-06-02T12:45:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "办公助手",
    "description": "提高工作效率的办公软件。",
    "createTime": "2024-06-01T12:30:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "健康追踪器",
    "description": "记录和分析您的日常健康数据。",
    "createTime": "2024-06-02T12:45:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "学习乐园",
    "description": "儿童在线学习平台。",
    "createTime": "2024-06-03T12:20:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "美食探索",
    "description": "发现和分享美食的社区应用。",
    "createTime": "2024-06-04T12:50:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "旅行规划",
    "description": "帮助用户规划旅行的智能助手。",
    "createTime": "2024-06-05T12:10:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "健身教练",
    "description": "个性化健身计划和指导。",
    "createTime": "2024-06-06T12:35:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "财务管理",
    "description": "个人财务管理和预算规划工具。",
    "createTime": "2024-06-07T12:25:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "社交网络",
    "description": "连接朋友和家人的社交平台。",
    "createTime": "2024-06-08T12:40:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  },
  {
    "appName": "在线教育",
    "description": "提供在线课程和教育资源。",
    "createTime": "2024-06-09T12:15:00+08:00",
    "status": "active",
    "actions": "edit, delete"
  },
  {
    "appName": "音乐播放器",
    "description": "流媒体音乐服务。",
    "createTime": "2024-06-10T12:30:00+08:00",
    "status": "inactive",
    "actions": "edit, delete"
  }
]

@Component({
  selector: 'hs-table',
  templateUrl: './hs-table.component.html',
  styleUrls: ['./hs-table.component.less'],
  imports: [MatTableModule, MatButtonModule, NgScrollbarModule],
})
export class HsTableComponent implements OnInit {
  displayedColumns: string[] = ['appName', 'description', 'createTime', 'status', 'index',];
  data = ELEMENT_DATA;
  ngOnInit() {}
}
