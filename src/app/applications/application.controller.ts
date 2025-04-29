import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { HsApplicationService } from './application.service';
import { HsApplication } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';
import { PageDto } from 'src/common/dtos/page.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: HsApplicationService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<HsApplication> {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<HsApplication>> {
    return this.applicationService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HsApplication> {
    return this.applicationService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<HsApplication> {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.applicationService.remove(id);
  }
}
