import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  bucket: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  sort_order?: number = 0;
}
