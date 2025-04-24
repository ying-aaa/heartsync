import { Observable } from "rxjs";

export enum SORTFILTER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ColumnType {
  SELECTION = 'selection',
  TEXT = 'text',
  DATE = 'date',
  IMG = 'img',
  TAG = 'tag',
  SWITCH = 'switch',
  NUMBER = 'number',
  ACTION = 'action',
}

export interface ColumnConfigPropType { }

export class BaseColumn<T = any> {
  constructor(
    public type: ColumnType,
    public prop: string,
    public label: string,
    public width: number | string,
    public align: string = 'center',
    public className?: string,
    public config?: T,
  ) { }
}

export class CustomColumn extends BaseColumn {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
  ) {
    super(ColumnType.TEXT, prop, label, width, align, className);
  }
}

export class TextColumn extends BaseColumn {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
  ) {
    super(ColumnType.TEXT, prop, label, width, align, className);
  }
}

export class DateColumn extends BaseColumn {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
    public override config?: { dateFormat: string },
  ) {
    super(ColumnType.DATE, prop, label, width, align, className, config);
  }
}

export class ImgColumn extends BaseColumn<{ src: string }> {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
    public override config?: { src: string },
  ) {
    super(ColumnType.IMG, prop, label, width, align, className, config);
  }
}

export class TagColumn extends BaseColumn<{ color: string }> {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
    public override config?: { color: string },
  ) {
    super(ColumnType.TAG, prop, label, width, align, className, config);
  }
}

export class SwitchColumn extends BaseColumn<{
  activeValue: any;
  inactiveValue: any;
}> {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
    public override config?: { activeValue: any; inactiveValue: any },
  ) {
    super(ColumnType.SWITCH, prop, label, width, align, className, config);
  }
}

export class SelectionColumn extends BaseColumn<{
  selectable: (row: any) => boolean;
}> {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
    public override config?: { selectable: (row: any) => boolean },
  ) {
    super(ColumnType.SELECTION, prop, label, width, align, className, config);
  }
}

export class ActionColumn extends BaseColumn<
  Array<{
    name: string;
    icon: string;
    action: (row: any, event: Event) => void;
  }>
> {
  constructor(
    public override prop: string,
    public override label: string,
    public override width: number | string,
    public override align: string = 'center',
    public override className?: string,
    public override config?: Array<{
      name: string;
      icon: string;
      action: (row: any, event: Event) => void;
    }>,
  ) {
    super(ColumnType.ACTION, prop, label, width, align, className, config);
  }
}

export type TableColumn = SelectionColumn
  | CustomColumn
  | TextColumn
  | DateColumn
  | ImgColumn
  | TagColumn
  | SwitchColumn
  | ActionColumn;

export interface QySearchParams {
  [key: string]: string | number;
}

export interface QySortParams {
  [key: string]: SORTFILTER;
}

export interface DataType {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
}

// 类
export class QueryParams {
  public searchParams: QySearchParams = {};
  public getData: () => void;

  constructor(
    public queryFormConfig: any[],
    public queryButtonConfig: any,
    public sortParams: QySortParams = {},
  ) {
    if (queryFormConfig) {
      this.queryFormConfig.forEach((item: any) => {
        this.searchParams[item.prop] = item.config?.default || '';
      });
    }
  }

  // 修改排序
  changeSort(prop: string): void {
    const currentSortOrder = this.sortParams[prop];
    if (currentSortOrder) {
      this.sortParams[prop] =
        currentSortOrder === SORTFILTER.ASC ? SORTFILTER.DESC : SORTFILTER.ASC;
    } else {
      this.sortParams[prop] = SORTFILTER.DESC;
    }
  }

  // 修改搜索
  changeSearch(prop: string, value: any): void {
    this.searchParams[prop] = value;
  }

  // 重置搜索
  reset(): void {
    this.searchParams = {};
    this.sortParams = {};
    this.getData();
  }
}

export class PageLink extends QueryParams {
  public table: any;
  public total: number = 0;
  public columnConfig: any[];
  public multipleSelection: any[] = []; // table选中项
  public multipleFiled: string = ''; // table默认选中的校准字段
  public tableData: any[] = []; // table 数据
  public override getData: () => void;

  public get queryParams(): QySearchParams {
    const { page, pageSize } = this;
    return { ...this.searchParams, page, pageSize };
  }

  constructor(
    public page: number = 1,
    public pageSize: number = 10,
    queryFormConfig: any[] = [],
    queryButtonConfig: any = {},
  ) {
    super(queryFormConfig, queryButtonConfig);
  }

  setGetData(getData: () => void): void {
    this.getData = getData;
  }

  setColumnConfig(columnConfig: any[], is: boolean = false): void {
    this.columnConfig = columnConfig.map((item) =>
      is ? item : { ...item, nohidden: true },
    );
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

  sortColumnConfig(newArr: any[]): void {
    this.columnConfig = newArr;
  }

  handlerColumn(value: string, prop: string, index?: number): void {
    if (index !== undefined) {
      this.columnConfig[index][prop] = value;
    } else {
      this.columnConfig.forEach((item) => (item[prop] = value));
    }
  }

  sortColumn(value: any[]): void {
    this.columnConfig = value;
    this.getData();
  }

  /**
   *
   * @param props 哪些属性值是传给后端的，不写则传已有属性，写了为传写入的
   * @param isString 是否是字符串拼接参数
   * @returns
   */
  toQueryString(
    props?: Array<string>,
    isString: boolean = true,
  ): string | QySearchParams {
    props = props ? props : Object.keys(this.queryParams);
    const { queryParams } = this;
    let params: any = isString ? '?' : {};
    for (const key of props) {
      const value = queryParams[key];
      if (value || value === 0) {
        isString ? (params += `${key}=${value}&`) : (params[key] = value);
      }
    }
    return isString ? params.slice(0, -1) : params;
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

export type ILayoutType = 'total' | 'sizes' | 'first/last';

type ConfigWithSelection = {
  selection: true;
  multipleFiled: string;
};

type ConfigWithoutSelection = {
  selection?: false;
  multipleFiled?: undefined;
};

type ConfigBase = {
  layouts?: ILayoutType[];
  pageSizes?: number[];
  pageDislabled?: boolean;
  pageLink: PageLink;
  tableColumn: Array<TableColumn>;
  getData: () => Observable<DataType>;
};

type ITableConfig = ConfigWithSelection & ConfigBase | ConfigWithoutSelection & ConfigBase;

export class IDynamicTable {
  public layouts: ILayoutType[];
  public selection: boolean;
  public pageSizes: number[];
  public pageDislabled?: boolean;
  public pageLink: PageLink;
  public tableColumn: BaseColumn[];
  public displayedColumns: string[] = []; // 显示的列

  public matchLayout = (layout: ILayoutType) => {
    return this.layouts.includes(layout);
  }

  getData: () => Observable<DataType>;

  constructor(config: ITableConfig) {
    this.layouts = config.layouts || [];
    this.selection = config.selection || false;
    this.pageSizes = config.pageSizes || [];
    this.pageDislabled = config.pageDislabled || false;
    this.pageLink = config.pageLink;
    this.tableColumn = config.tableColumn;
    this.getData = config.getData;

    if (this.selection) {
      this.tableColumn.unshift(new SelectionColumn(ColumnType.SELECTION, '选择', 50));
      this.pageLink.setMultipleFiled(config.multipleFiled || '');
    }
    this.displayedColumns = this.tableColumn.map((item) => item.prop);
  }
}
