import { IsNotEmpty, IsString } from 'class-validator';

export class SyncFieldDto {
  @IsString()
  @IsNotEmpty()
  dataSourceId: string;

  @IsString()
  @IsNotEmpty()
  tableName: string;
}
