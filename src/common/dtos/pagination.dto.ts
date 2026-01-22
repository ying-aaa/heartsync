import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
  IsArray,
  ValidateNested,
  IsIn,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IQUERY_MATCH_TYPES, IQueryMatchType } from '@heartsync/types';

export class MatchConditionDto {
  @IsString()
  @IsNotEmpty({ message: '查询字段不能为空' })
  @Length(1, 50, { message: '查询字段长度必须在1-50字符之间' })
  readonly searchField: string;

  @IsString()
  @IsIn(IQUERY_MATCH_TYPES, {
    message: `匹配类型只能是 ${IQUERY_MATCH_TYPES.join('/')}`,
  })
  readonly matchType: IQueryMatchType;

  @IsString()
  @IsNotEmpty({ message: '查询值不能为空' })
  @Length(1, 100, { message: '查询值长度必须在1-100字符之间' })
  readonly searchValue: string;
}

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly page: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9999)
  @IsOptional()
  readonly pageSize: number = 10;

  @IsString()
  @IsOptional()
  readonly sortBy?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(ASC|DESC)$/i, {
    message: '排序方式必须是 ASC 或 DESC',
  })
  readonly order?: 'ASC' | 'DESC';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchConditionDto)
  @IsOptional()
  readonly matchConditions?: MatchConditionDto[];
}
