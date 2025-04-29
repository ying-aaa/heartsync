export interface IResponseStructure<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IBaseResponseData<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  byDepartment: string;
}
