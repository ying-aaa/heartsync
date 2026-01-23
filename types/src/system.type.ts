export const IQUERY_MATCH_TYPES = ['all', 'like', 'prefix', 'suffix'] as const;
export type IQueryMatchType = (typeof IQUERY_MATCH_TYPES)[number];
export enum ISoftDeleteStatus {
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
  isDeleted?: ISoftDeleteStatus;
}
