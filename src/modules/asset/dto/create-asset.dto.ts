export class CreateAssetDto {
  id?: string;
  name: string;
  appId: string;
  dataSourceId: string;
  tableName: string;
  catalogId: string;
  comment?: string;
}
