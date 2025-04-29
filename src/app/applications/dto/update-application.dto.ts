import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ApplicationStatus } from './create-application.dto';

export class UpdateApplicationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  directoryId?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsOptional()
  tags?: Record<string, any>;
}
