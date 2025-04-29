import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly page: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
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
}
