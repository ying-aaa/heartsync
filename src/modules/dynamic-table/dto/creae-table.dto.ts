import {
  IsString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldConfigDto } from './field-config.dto';

export class CreateTableDto {
  @IsString()
  dataSourceId: string;

  @IsString()
  tableName: string;

  @IsOptional()
  @IsString()
  tableComment?: string;

  @ValidateNested({ each: true })
  @Type(() => FieldConfigDto)
  @ArrayMinSize(1)
  fields: FieldConfigDto[];
}
