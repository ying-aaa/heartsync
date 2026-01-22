export const IQUERY_MATCH_TYPES = ['all', 'like', 'prefix', 'suffix'] as const;
export type IQueryMatchType = (typeof IQUERY_MATCH_TYPES)[number];
