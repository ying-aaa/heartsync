export class PageDto<T> {
  readonly data: T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;

  constructor(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
    totalPages: number,
  ) {
    this.data = data;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    this.totalPages = totalPages;
  }
}
