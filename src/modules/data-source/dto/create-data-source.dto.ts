import { IsString, MinLength } from 'class-validator';
import { BaseDataSourceDto } from './base-data-source.dto';

export class CreateDataSourceDto extends BaseDataSourceDto {
  @IsString()
  @MinLength(6)
  password: string;
}
