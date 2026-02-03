import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 仪表板创建DTO - 新增仪表板接口入参
 */
export class UpdateDashboardDto {
  /**
   * 仪表板ID（必传，非空）
   */
  @IsString({ message: '仪表板ID必须为字符串' })
  @IsNotEmpty({ message: '仪表板ID不能为空' })
  id: string;
}
