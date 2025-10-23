import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';

export enum DataSourceStatus {
  Online = 'online',
  Offline = 'offline',
}

export class QueryDataSourceDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  appId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  // @IsString()
  // @IsOptional()
  // directoryId?: string;

  @IsEnum(DataSourceStatus)
  @IsOptional()
  status?: DataSourceStatus;
}
