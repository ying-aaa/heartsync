import {
  IsEnum,
  IsOptional,
  IsObject,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IFormWidgetSubTypes, IWhetherStatus } from '@heartsync/types';
import { BaseWidgetDto } from 'src/modules/widget/widget/dto/base-widget.dto';

export class CreateFormWidgetDto extends BaseWidgetDto {
  @IsOptional()
  @IsEnum(IFormWidgetSubTypes, { message: '表单子类型为无效值' })
  subType?: IFormWidgetSubTypes;

  @IsOptional()
  @IsArray({ message: '扁平化表单字段必须为数组' })
  @Type(() => Object)
  flatField?: any[];

  @IsOptional()
  @IsArray({ message: '画布类型表单字段必须为数组' })
  @Type(() => Object)
  canvasField?: any[];

  @IsOptional()
  @IsBoolean({ message: '是否使用流程必须为布尔值' })
  useFlow?: IWhetherStatus;

  @IsOptional()
  @IsObject({ message: '按钮配置必须为JSON对象' })
  @Type(() => Object)
  buttonConfig?: Record<string, any>;
}
