import {
  IsString,
  IsOptional,
  IsEnum,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export enum ApplicationStatus {
  Active = 'active',
  Disabled = 'disabled',
  Pending = 'pending',
}

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  directoryId: string;

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
  status: ApplicationStatus = ApplicationStatus.Active;

  @IsOptional()
  tags?: Record<string, any>;
}
