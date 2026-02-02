import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateCodeWidgetDto } from './create-code-widget.dto';

export class UpdateCodeWidgetDto extends PartialType(CreateCodeWidgetDto) {
  @IsString({ message: '代码部件ID必须为字符串' })
  @IsNotEmpty({ message: '代码部件ID不能为空' })
  id: string;
}
