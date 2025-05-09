import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class MoveNodeDto {
  @IsString()
  @IsOptional()
  newParentId?: string; // 新父节点ID（null表示根目录）

  @IsString()
  @IsNotEmpty()
  businessId: string; // 目标业务ID（用于跨业务移动校验）

  @IsString()
  @IsOptional()
  businessKey: string; // 目标业务ID（用于跨业务移动校验）

  // 可选：移动后名称（用于重命名移动）
  @IsString()
  @IsOptional()
  newName?: string;
}
