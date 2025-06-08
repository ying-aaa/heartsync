import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { HsMenuService } from './hs-menu.service';
import { HsMenuEntity } from 'src/database/entities/hs-menu.entity';
import {
  CreateHsMenuDto,
  BatchUpdateHsMenuDto,
  UpdateHsMenuDto,
  ReorderHsMenuDto,
} from './dot/hs-menu.dto';

@Controller('menus')
export class HsMenuController {
  constructor(private readonly menuService: HsMenuService) {}

  @Post()
  create(@Body() createDto: CreateHsMenuDto): Promise<HsMenuEntity> {
    return this.menuService.create(createDto);
  }

  @Put('batch')
  batchUpdate(@Body() batchDto: BatchUpdateHsMenuDto): Promise<HsMenuEntity[]> {
    return this.menuService.batchUpdate(batchDto);
  }

  @Get('app/:appId')
  async getByAppId(@Param('appId') appId: string) {
    return this.menuService.getByAppId(appId);
  }

  @Get()
  getMenus(@Query('parentId') parentId?: string): Promise<HsMenuEntity[]> {
    return parentId
      ? this.menuService.getChildren(parentId)
      : this.menuService.getFullTree();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<HsMenuEntity> {
    return this.menuService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateDto: UpdateHsMenuDto,
  ): Promise<HsMenuEntity> {
    return this.menuService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.menuService.delete(id);
  }

  @Post('reorder')
  reorder(@Body() reorderDto: ReorderHsMenuDto): Promise<HsMenuEntity[]> {
    return this.menuService.reorder(reorderDto);
  }
}
