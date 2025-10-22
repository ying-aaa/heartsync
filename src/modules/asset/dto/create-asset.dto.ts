import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  appId?: string;

  @IsString()
  @IsNotEmpty()
  dataSourceId: string;

  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsString()
  @IsOptional()
  directoryId?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
