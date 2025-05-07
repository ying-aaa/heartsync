import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import {
  IEditorFormlyField,
  IFormButtonConfig,
  IFormFlowConfig,
  IFormLogicConfig,
  IFormStyle,
  IFormSubTypes,
} from '../form-widget.entity';

export class CreateFormWidgetDto {
  @ApiProperty({ description: 'Widget ID', example: 'widget123' })
  @IsString()
  widgetId: string;

  @ApiProperty({ description: 'Form Name', example: 'My Form' })
  @IsString()
  formName: string;

  @ApiProperty({
    description: 'Edit Name',
    example: 'Edit My Form',
    required: false,
  })
  @IsOptional()
  @IsString()
  editName?: string;

  @ApiProperty({
    description: 'Sub Type',
    example: { type: 'text' },
    required: false,
  })
  @IsOptional()
  subType?: IFormSubTypes;

  @ApiProperty({
    description: 'Form Style',
    example: { color: 'blue' },
    required: false,
  })
  @IsOptional()
  formStyle?: IFormStyle;

  @ApiProperty({
    description: 'Flat Type Field',
    example: { type: 'text' },
    required: false,
  })
  @IsOptional()
  flatTypeField?: IEditorFormlyField;

  @ApiProperty({
    description: 'Canvas Type Field',
    example: { type: 'canvas' },
    required: false,
  })
  @IsOptional()
  canvasTypeField?: IEditorFormlyField;

  @ApiProperty({ description: 'Is Use Flow', example: false })
  @IsBoolean()
  @IsOptional()
  isUseFlow: boolean;

  @ApiProperty({
    description: 'Flow Config',
    example: { steps: [] },
    required: false,
  })
  @IsOptional()
  flowConfig?: IFormFlowConfig;

  @ApiProperty({
    description: 'Logic Config',
    example: { rules: [] },
    required: false,
  })
  @IsOptional()
  logicConfig?: IFormLogicConfig;

  @ApiProperty({
    description: 'Button Config',
    example: { label: 'Submit' },
    required: false,
  })
  @IsOptional()
  buttonConfig?: IFormButtonConfig;
}
