import { IsOptional, IsString, IsNotEmpty, IsObject } from 'class-validator';

export class UpdateNodeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional() // 允许仅更新metadata时不传name
  name?: string;

  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;
}
