import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { HsFileTreeService } from './file-tree.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { MoveNodeDto } from './dto/move-node.dto';
import { BusinessParams } from 'src/decorators/business-params.decorator';

@Controller('nodes')
// @UseGuards(BusinessGuard)
export class HsFileTreeController {
  constructor(private readonly service: HsFileTreeService) {}

  /**
   * 创建新节点
   * @param dto 请求体参数 {
   *   businessId: string  // 业务标识（必填）
   *   parentId?: number   // 父节点ID（可选，不传表示根目录）
   *   name: string        // 节点名称（必填）
   *   type: NodeType      // 节点类型 FILE/DIRECTORY（必填）
   *   meta?: object       // 扩展元数据（可选）
   * }
   * @param businessId 从上下文自动提取的业务ID（用于二次校验）
   */
  // , @BusinessId() businessId: string
  @Post()
  create(@Body() dto: CreateNodeDto) {
    return this.service.create({ ...dto });
  }

  /**
   * 更新节点信息
   * @param id 路径参数 - 节点ID（数字）
   * @param dto 请求体参数 {
   *   name?: string       // 新名称（可选）
   *   meta?: object       // 新元数据（可选）
   * }
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNodeDto) {
    return this.service.update(id, dto);
  }

  /**
   * 移动节点
   * @param id 路径参数 - 要移动的节点ID（数字）
   * @param dto 请求体参数 {
   *   newParentId?: number // 新父节点ID（可选，不传表示移动到根目录）
   *   businessId: string   // 目标业务ID（必填，用于跨业务校验）
   *   newName?: string     // 移动后的新名称（可选）
   * }
   */
  @Post('/move/:id')
  move(@Param('id') id: string, @Body() dto: MoveNodeDto) {
    return this.service.move(id, dto);
  }

  /**
   * 删除节点
   * @param id 路径参数 - 要删除的节点ID（数字）
   * @description 注意：删除目录时需要确保没有子节点
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }

  @Get('/tree')
  getEntireTree(@BusinessParams() BusinessParams: object) {
    console.log(
      '%c Line:79 🥝 BusinessParams',
      'color:#3f7cff',
      BusinessParams,
    );
    return this.service.getEntireTree(BusinessParams);
  }

  /**
   * 获取子节点列表
   * @param parentId 查询参数 - 父节点ID（数字，不传表示根目录）
   * @param businessId 自动提取的业务ID（来自查询参数或请求头）
   */
  @Get('/children')
  getChildren(
    @Query('parentId') parentId: string,
    @BusinessParams() BusinessParams: object,
  ) {
    console.log('%c Line:92 🌶', 'color:#2eafb0', BusinessParams);
    return this.service.getChildren(parentId ? parentId : null, BusinessParams);
  }
}
