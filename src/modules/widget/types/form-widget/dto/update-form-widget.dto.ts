import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateFormWidgetDto } from './create-form-widget.dto';

export class UpdateFormWidgetDto extends PartialType(CreateFormWidgetDto) {
  @IsString({ message: '部件ID必须为字符串' })
  @IsNotEmpty({ message: '部件ID不能为空' })
  id: string;
}
