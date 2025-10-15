import {
  IsString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldConfigDto } from './field-config.dto';
import { FieldValueCountValidator } from 'src/common/validators/field-value-count.validator';
import { UniqueFieldValidator } from 'src/common/validators/unique-field.validator';
import { ValidTableNameValidator } from 'src/common/validators/table-name.validator';

export class CreateTableDto {
  @IsString()
  dataSourceId: string;

  @IsString()
  @Validate(ValidTableNameValidator) // 表名严格校验
  tableName: string;

  @IsOptional()
  @IsString()
  tableComment?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FieldConfigDto)
  @Validate(UniqueFieldValidator, ['name'])
  @Validate(FieldValueCountValidator, ['isPrimaryKey', true, 1])
  fields: FieldConfigDto[];
}
