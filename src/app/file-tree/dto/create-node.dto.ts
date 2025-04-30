import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NodeType } from '../entities/file-node.entity';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(NodeType)
  type: NodeType;

  @IsOptional()
  meta?: Record<string, any>;
}
