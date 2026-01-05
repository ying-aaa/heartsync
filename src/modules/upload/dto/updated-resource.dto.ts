import { IsOptional, IsString } from 'class-validator';

export class UpdatedResourceDto {
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  original_name?: string;
}
