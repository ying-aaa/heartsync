import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Validate,
} from 'class-validator';
import { ValidFieldNameValidator } from 'src/common/validators/field-name.validator';
import { IFieldType } from 'src/database/entities/hs-asset-field.entity';

export class FieldConfigDto {
  @IsString()
  @Validate(ValidFieldNameValidator) // 表名严格校验
  name: string;

  @IsString()
  @IsEnum(IFieldType)
  fieldType: IFieldType;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  length?: number;

  @IsOptional()
  @IsBoolean()
  notNull = false;

  @IsOptional()
  @IsBoolean()
  isPrimaryKey = false;
}
