import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HsSelfRecord } from '../../../database/entities/hs-self-record.entity';
import { HsSelfRecordService } from './self-record.service';

@Controller('/self-records')
export class HsSelfRecordController {
  constructor(private readonly hsSelfRecordService: HsSelfRecordService) {}

  @Post()
  create(@Body() record: Partial<HsSelfRecord>) {
    return this.hsSelfRecordService.create(record);
  }

  @Get()
  findAll() {
    return this.hsSelfRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.hsSelfRecordService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() record: Partial<HsSelfRecord>) {
    return this.hsSelfRecordService.update(id, record);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hsSelfRecordService.remove(id);
  }
}
