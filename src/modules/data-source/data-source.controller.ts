import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { HsDataSourceService } from './data-source.service';
import { CreateDataSourceDto } from './dto/create-data-source.dto';

/**
 * 数据源控制器：提供RESTful API接口
 * 接口前缀：/api/data-sources
 */
@Controller('data-sources')
export class HsDataSourceController {
  constructor(private readonly service: HsDataSourceService) {}

  /**
   * 创建数据源
   * POST /api/data-sources
   */
  @Post()
  create(@Body() data: CreateDataSourceDto) {
    return this.service.create(data);
  }

  /**
   * 测试数据源连接
   * GET /api/data-sources/test
   */
  @Post('/test')
  testConnection(@Body() data: CreateDataSourceDto) {
    return this.service.testConnection(data);
  }

  /**
   * 获取所有数据源
   * GET /api/data-sources
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /**
   * 获取单个数据源详情, id必填
   * GET /api/data-sources/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * 根据已有的测试数据源连接
   * GET /api/data-sources/:id/test
   */
  @Get(':id/test')
  testConnectionById(@Param('id') id: string) {
    return this.service.testConnectionById(id);
  }

  /**
   * 获取数据源表列表
   * GET /api/data-sources/:id/tables
   */
  @Get(':id/tables')
  getTableList(@Param('id') id: string) {
    return this.service.getTableList(id);
  }

  /**
   * 删除数据源
   * DELETE /api/data-sources/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
