import { Observable } from 'rxjs';
import dayjs from 'dayjs';
import { isNotEmpty, isNumber, isString } from '@src/app/core/utils';
import { IAnyPropObj } from '../../models/common-component';
import { HttpParams } from '@angular/common/http';

export enum ColumnType {
  SELECTION = 'selection',
  TEXT = 'text',
  CUSTOM = 'custom',
  DATE = 'date',
  IMG = 'img',
  TAG = 'tag',
  SWITCH = 'switch',
  NUMBER = 'number',
  ACTION = 'action',
}

export interface ColumnConfigPropType {}

export type IColumnAlign = 'left' | 'center' | undefined;
export class BaseColumn<T = any> {
  getWidth(width: number | string) {
    if (isNumber(width) || Number(width)) return width + 'px';
    return width || 'auto';
  }

  constructor(
    public type: ColumnType,
    public prop: string,
    public label: string,
    public config?: T,
    public width?: number | string,
    public align?: IColumnAlign,
    public className?: string,
  ) {}
}

export class CustomColumn extends BaseColumn {
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: {
      click?: () => void;
    },
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.CUSTOM, prop, label, config, width, align, className);
  }
}

export class TextColumn extends BaseColumn {
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: {
      click?: (row: any, event: Event) => void;
      styles?: IAnyPropObj;
    },
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.TEXT, prop, label, config, width, align, className);
  }
}

export class DateColumn extends BaseColumn {
  public format = (time: string | number | Date | dayjs.Dayjs) =>
    dayjs(time).format(this.config?.dateFormat || 'YYYY-MM-DD HH:mm:ss');
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: { dateFormat: string; click?: () => void },
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.DATE, prop, label, config, width, align, className);
  }
}

export class ImgColumn extends BaseColumn<{ defaultValue?: any }> {
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: {
      defaultValue?: any;
      click?: () => void;
    },
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.IMG, prop, label, config, width, align, className);
  }
}

interface TagMap {
  color: string;
  value: string | number;
  label: string;
}

// 定义一个类型，表示 config 必须包含 request 或 tagMap，但不能同时包含两者
type TagConfigType =
  | {
      request: Observable<Array<TagMap>>;
      tagMap?: never; // 确保不能同时存在
      click?: (tag: TagMap) => void;
    }
  | {
      request?: never; // 确保不能同时存在
      tagMap: Array<TagMap>;
      click?: (tag: TagMap) => void;
    };

export class TagColumn extends BaseColumn<TagConfigType> {
  tagMap: Array<TagMap> = [];

  constructor(
    public override prop: string,
    public override label: string,
    public override config?: TagConfigType,
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.TAG, prop, label, config, width, align, className);

    if (config?.tagMap) {
      this.tagMap = config.tagMap;
    } else if (config?.request) {
      config.request.subscribe((data) => {
        this.tagMap = data;
      });
    }
  }

  getChips(value: string | number | Array<string | number>): Array<string | number> {
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    } else {
      return [value];
    }
  }

  getLabel(value: string | number): string {
    const tag = this.tagMap.find((item) => item.value === value);
    return tag ? tag.label : value.toString();
  }

  getColor(value: string | number): string {
    const tag = this.tagMap.find((item) => item.value === value);
    return tag ? tag.color : 'transparent';
  }
}

export class SwitchColumn extends BaseColumn<{
  activeValue: any;
  inactiveValue: any;
}> {
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: { activeValue: any; inactiveValue: any },
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.SWITCH, prop, label, config, width, align, className);
  }
}

export class SelectionColumn extends BaseColumn<{
  selectable: (row: any) => boolean;
}> {
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: {
      selectable: (row: any) => boolean;
      click?: () => void;
    },
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.SELECTION, prop, label, config, width, align, className);
  }
}

export class ActionColumn extends BaseColumn<
  Array<{
    name: string;
    icon: string;
    action: (row: any, event: Event) => void;
    moreName?: string;
  }>
> {
  constructor(
    public override prop: string,
    public override label: string,
    public override config?: Array<{
      name: string;
      icon: string;
      action: (row: any, event: Event) => void;
      moreName?: string;
    }>,
    public override width?: number | string,
    public override align?: IColumnAlign,
    public override className?: string,
  ) {
    super(ColumnType.ACTION, prop, label, config, width, align, className);
  }
}

export type TableColumn =
  | SelectionColumn
  | CustomColumn
  | TextColumn
  | DateColumn
  | ImgColumn
  | TagColumn
  | SwitchColumn
  | ActionColumn
  | any;

export type ISortType = 'ASC' | 'DESC';

export interface DataType {
  data: any[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface IsearchConfig {
  prop: string;
  defaultValue?: any;
}

export interface ISortConfig {
  sortBy: string;
  order?: ISortType;
}

export interface IQueryDatatype {
  page: number;
  pageSize: number;
  sortBy?: string;
  order?: ISortType;
  [key: string]: any;
}

// 类
export class QueryParams {
  public searchData: IAnyPropObj = {};
  public sortData: { sortBy?: any; order?: ISortType } = {};
  public getData: () => void;

  constructor(
    public searchParams: IsearchConfig[],
    public sortParams: ISortConfig[],
  ) {
    searchParams.forEach((item) => {
      this.searchData[item.prop] = item.defaultValue || '';
    });

    const sort = this.sortParams.find((item) => item.order);
    if (sort) {
      this.sortData.sortBy = sort.sortBy;
      this.sortData.order = sort.order;
    }
  }

  public isSortField(prop: string): boolean {
    const is = this.sortParams.find((item) => item.sortBy === prop);
    return !!is;
  }

  // 修改排序
  public changeSort(prop: string, value?: ISortType): void {
    if (value) {
      this.sortData.sortBy = prop;
      this.sortData.order = value;
    } else {
      this.sortData = {};
    }
    this.getData();
  }

  // 修改搜索
  public changeSearch(prop: string, value: any): void {
    this.searchData[prop] = value;
  }

  // 重置搜索
  public reset(): void {
    this.searchData = {};
    this.sortData = {};
    this.getData();
  }
}

export type IOrder = 'ASC' | 'DESC';

export class PageLink extends QueryParams {
  public table: any;
  public total: number = 0;
  public multipleSelection: any[] = []; // table选中项
  public multipleFiled: string = ''; // table默认选中的校准字段
  public tableData: any[] = []; // table 数据
  public override getData: () => void = () => {};

  constructor(
    public page: number = 1,
    public pageSize: number = 10,
    public override searchParams: IsearchConfig[] = [],
    public override sortParams: ISortConfig[] = [],
  ) {
    super(searchParams, sortParams);
  }

  setGetData(getData: () => void): void {
    this.getData = getData;
  }

  setTableData(tableData: any[]): void {
    this.tableData = tableData;
  }

  setMultipleSelection(val: any[]): void {
    this.multipleSelection = val;
  }

  setMultipleFiled(val: string): void {
    this.multipleFiled = val;
  }

  get fieldMultipleSelection(): any[] {
    return this.multipleSelection.map((item) => item[this.multipleFiled]).filter(Boolean);
  }

  public get getQueryParams(): IAnyPropObj {
    const { page, pageSize } = this;
    const queryParams = {
      ...this.searchData,
      ...this.sortData,
      page,
      pageSize,
    };
    return queryParams;
  }

  toQueryString(props?: Array<string>): string {
    props = props ? props : Object.keys(this.searchData);
    let params: string = '?';
    for (const prop of props) {
      const value = this.getQueryParams[prop];
      if (isNotEmpty(value)) params += `${prop}=${value}&`;
    }
    return params.slice(0, -1);
  }

  toQueryObj(props?: Array<string>): IQueryDatatype {
    props = props ? props : Object.keys(this.searchData);
    const { page, pageSize } = this;
    let params: IQueryDatatype = { page, pageSize };
    for (const prop of props) {
      const value = this.getQueryParams[prop];
      if (isNotEmpty(value)) params[prop] = value;
    }
    return params;
  }

  toQueryHttp(props?: Array<string>): HttpParams {
    props = props ? props : Object.keys(this.getQueryParams);
    let params: HttpParams = new HttpParams();
    for (const prop of props) {
      const value = this.getQueryParams[prop];
      if (isNotEmpty(value)) params = params.set(prop, value);
    }
    return params;
  }

  prevPage(): void {
    if (this.page <= 1) return;
    this.page--;
    this.getData();
  }

  nextPage(): void {
    if (this.page >= Math.ceil(this.total / this.pageSize)) return;
    this.page++;
    this.getData();
  }

  // 改变当前页
  changePage(page: number): void {
    if (page < 0 || page + 1 > Math.ceil(this.total / this.pageSize)) return;
    this.page = page;
    this.getData();
  }

  // 改变每页条数
  changePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.changePage(0);
  }

  // 更新获取的条数
  updateTotal(total: number): void {
    this.total = total;
  }
}

export type ILayoutType = 'paginator' | 'total' | 'sizes' | 'first/last';

type ConfigWithSelection = {
  selection: true;
  multipleFiled: string;
};

type ConfigWithoutSelection = {
  selection?: false;
  multipleFiled?: undefined;
};

type ConfigBase = {
  tableStyle?: IAnyPropObj;
  layouts?: ILayoutType[];
  pageSizes?: number[];
  pageDislabled?: boolean;
  pageLink: PageLink;
  tableColumn: Array<TableColumn>;
  initExec?: boolean;
  getColumns?: () => Observable<TableColumn[]>;
  getData: () => Observable<DataType>;
};

type ITableConfig = (ConfigWithSelection & ConfigBase) | (ConfigWithoutSelection & ConfigBase);

export class IDynamicTable {
  public tableStyle: IAnyPropObj;
  public layouts: ILayoutType[];
  public selection: boolean;
  public pageSizes: number[];
  public pageDislabled?: boolean;
  public pageLink: PageLink;
  public tableColumn: TableColumn[] = [];
  public displayedColumns: string[] = []; // 显示的列
  public initExec: boolean = true; // 初始化时请求数据

  public matchLayout = (layout: ILayoutType) => {
    return this.layouts.includes(layout);
  };

  getColumns?: () => Observable<TableColumn[]>;
  setColumns(columns: TableColumn[]) {
    this.tableColumn = columns;
    this.displayedColumns = columns.map((column) => column.prop);
  }

  getData: () => Observable<DataType>;

  constructor(config: ITableConfig) {
    this.tableStyle = config.tableStyle || {};
    this.layouts = config.layouts || [];
    this.selection = config.selection ?? false;
    this.pageSizes = config.pageSizes || [];
    this.pageDislabled = config.pageDislabled ?? false;
    this.pageLink = config.pageLink;
    this.tableColumn = config.tableColumn;
    this.getColumns = config.getColumns;
    this.getData = config.getData;
    this.initExec = config.initExec ?? true;

    if (this.selection) {
      this.tableColumn.unshift(new SelectionColumn(ColumnType.SELECTION, '选择'));
      this.pageLink.setMultipleFiled(config.multipleFiled || '');
    }

    this.displayedColumns = this.tableColumn.map((item) => item.prop);
  }
}
