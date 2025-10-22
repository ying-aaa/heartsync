import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HsDashboardService } from './dashboard.service';
import { HsDashboardEntity } from 'src/database/entities/hs-dashboard.entity';
import { CreateDashboardDto } from './dto/create-dashboard.dto';

@Controller('dashboards')
export class HsDashboardController {
  constructor(private readonly dashboardService: HsDashboardService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardService.findById(id);
  }

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Post()
  create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardService.create(createDashboardDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<HsDashboardEntity>,
  ) {
    return this.dashboardService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(id);
  }
}
