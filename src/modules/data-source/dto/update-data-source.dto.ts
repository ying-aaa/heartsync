import { IsString, MinLength, IsOptional } from 'class-validator';
import { BaseDataSourceDto } from './base-data-source.dto';

export enum DB_TYPES {
  Mysql = 'mysql',
  Postgres = 'postgres',
  Sqlserver = 'sqlserver',
}

export class UpdateDataSourceDto extends BaseDataSourceDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
