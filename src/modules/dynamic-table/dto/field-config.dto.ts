import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { IFieldType } from 'src/database/entities/hs-asset-field.entity';

export class FieldConfigDto {
  @IsString()
  name: string;

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
