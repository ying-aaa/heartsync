import { Exclude } from 'class-transformer';

export class ExcludeSystemFieldsDto {
  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  @Exclude()
  createdBy: string;

  @Exclude()
  updatedBy: string;

  @Exclude()
  byDepartment: string;

  @Exclude()
  isDeleted?: boolean;

  @Exclude()
  version?: number;
}
