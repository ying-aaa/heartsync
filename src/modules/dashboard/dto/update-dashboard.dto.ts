import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateDashboardDto } from './create-dashboard.dto';

/**
 * 仪表板创建DTO - 新增仪表板接口入参
 */
export class UpdateDashboardDto extends CreateDashboardDto {
  /**
   * 仪表板ID（必传，非空）
   */
  @IsString({ message: '仪表板ID必须为字符串' })
  @IsNotEmpty({ message: '仪表板ID不能为空' })
  id: string;

  /**
   * 节点ID（可以为空）
   */
  @IsString({ message: '节点ID必须为字符串' })
  @IsOptional()
  nodeId: string;
}
