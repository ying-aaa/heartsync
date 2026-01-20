import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
} from 'angular-gridster2';
import { IFileData } from '@src/app/shared/models/common-component';

export enum DashboardType {}

export interface IDashboardWidgetContext extends GridsterItem {
  id?: string;
  widgetId?: string;
  name: string;
  description?: string;
  type: IWidgetType;
  config?: Record<string, any>;
  image?: string;
}

export interface IGridsterOption extends GridsterConfig {
  backgroundColor?: string;
  backgroundImageFileData?: IFileData[];
  backgroundSize?: string;
  // backgroundPosition?: string;
}

export interface IDashboardContext {
  id?: string;
  nodeId?: string;
  name: string;
  description?: string;
  layoutConfig?: Record<string, any>;
  gridsterOption?: IGridsterOption;
  widgets?: IDashboardWidgetContext[];
  dataSources?: Record<string, any>;
  accessControl?: Record<string, any>;
  appId?: string;
  isActive?: boolean;
  type?: 'gridster' | 'custom';
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = '/api/dashboards'; // 替换为你的API地址

  constructor(private http: HttpClient) {}

  // 获取单个仪表盘
  getDashboard(id: string): Observable<IDashboardContext> {
    return this.http.get<IDashboardContext>(`${this.apiUrl}/${id}`);
  }

  // 获取所有仪表盘
  getAllDashboards(): Observable<IDashboardContext[]> {
    return this.http.get<IDashboardContext[]>(this.apiUrl);
  }

  // 创建仪表盘
  createDashboard(data: IDashboardContext): Observable<any> {
    data.gridsterOption = {
      gridType: GridType.Fit,
      outerMargin: true,
      margin: 10,
      displayGrid: DisplayGrid.OnDragAndResize,
      enableOccupiedCellDrop: true,
      minCols: 1,
      minRows: 1,
      backgroundColor: 'transparent',
      backgroundImageFileData: [],
      backgroundSize: 'cover',
      // backgroundPosition: 'center',
    };
    return this.http.post(this.apiUrl, data);
  }

  // 更新仪表盘
  updateDashboard(
    id: string,
    data: IDashboardContext,
  ): Observable<IDashboardContext> {
    return this.http.put<IDashboardContext>(`${this.apiUrl}/${id}`, data);
  }

  // 删除仪表盘
  removeDashboard(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
