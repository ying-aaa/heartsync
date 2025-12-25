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
  BadRequestException,
} from '@nestjs/common';
import { HsApplicationService } from './application.service';
import { HsApplicationEntity } from '../../database/entities/hs-application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import {
  RoleGuard,
  RoleMatchingMode,
  Roles,
  Unprotected,
} from 'nest-keycloak-connect';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: HsApplicationService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<HsApplicationEntity> {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  @Roles({ roles: ['super-admin'], mode: RoleMatchingMode.ALL })
  async findAll(
    @Query() queryApplicationDto: QueryApplicationDto,
  ): Promise<PageDto<HsApplicationEntity>> {
    return this.applicationService.findAll(queryApplicationDto);
  }

  @Get('check-data')
  async checkData(@Query('directoryId') directoryId: string) {
    // 检查 directoryId 是否必传且为字符串
    if (!directoryId || typeof directoryId !== 'string') {
      throw new BadRequestException('directoryId是必需的，并且必须是字符串');
    }

    const hasData = await this.applicationService.hasData({ directoryId });
    return { hasData };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HsApplicationEntity> {
    return this.applicationService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<HsApplicationEntity> {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.applicationService.remove(id);
  }
}
