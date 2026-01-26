export const IQUERY_MATCH_TYPES = ['all', 'like', 'prefix', 'suffix'] as const;
export type IQueryMatchType = (typeof IQUERY_MATCH_TYPES)[number];
export enum IWhetherStatus {
  UNDELETED = 0,
  DELETED = 1,
}
export interface IBaseData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  byDepartment: string;
  isDeleted?: IWhetherStatus;
}

export interface IFileData {
  id?: string;
  status?: string;
  path?: string;
  progress?: number;
  name: string;
  url: string;
}
