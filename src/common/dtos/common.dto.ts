import { IsOptional, IsString } from 'class-validator';

export class FileListDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  status?: string;

  @IsString()
  name: string;

  @IsString()
  url: string;
}
