import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateFormDto {
  @IsString()
  name: string; // 表单名称

  @IsNumber()
  userId: number; // 提交用户ID

  @IsOptional()
  @IsString()
  content?: string; // 表单内容（可选）

  @IsOptional()
  @IsDateString()
  submitTime?: string; // 提交时间（可选，默认当前时间）
}
