import { Controller, Post, Body, Param } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { HsFormSubmitService } from './form-submit.service';

@Controller('datasources/:dataSourceId/tables/:tableName/forms')
export class HsFormSubmitController {
  // constructor(private readonly formService: HsFormSubmitService) {}
  /**
   * 创建表单数据
   * POST /datasources/{dataSourceId}/tables/{tableName}/forms
   */
  // @Post()
  // create(
  //   @Param('dataSourceId') dataSourceId: string,
  //   @Param('tableName') tableName: string,
  //   @Body() createFormDto: CreateFormDto,
  // ) {
  //   return this.formService.create(dataSourceId, tableName, createFormDto);
  // }
}
