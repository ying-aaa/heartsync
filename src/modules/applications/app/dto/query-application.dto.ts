import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';

export enum ApplicationStatus {
  Active = 'active',
  Disabled = 'disabled',
  Pending = 'pending',
}

export class QueryApplicationDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  directoryId?: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus = ApplicationStatus.Active;

  @IsOptional()
  @IsOptional()
  tags?: Record<string, any>;

  @IsString()
  @IsOptional()
  versionId?: string;
}
