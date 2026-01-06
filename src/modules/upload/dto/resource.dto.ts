import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';

export class UpdatedResourceDto {
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  original_name?: string;
}

export class QueryResourceDto extends PageOptionsDto {
  @IsString()
  bucket: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
