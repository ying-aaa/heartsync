import { Controller, Post, Body } from '@nestjs/common';
import { CreateTableDto } from './dto/creae-table.dto';
import { HsDynamicTableService } from './dynamic-table.service';

@Controller('dynamic-table')
export class HsDynamicTableController {
  constructor(private readonly dynamicService: HsDynamicTableService) {}

  @Post()
  create(@Body() dto: CreateTableDto) {
    return this.dynamicService.createTable(dto);
  }
}
