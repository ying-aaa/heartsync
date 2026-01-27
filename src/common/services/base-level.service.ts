import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FindOptionsOrder, Repository } from 'typeorm';
import { ILevelNode, IMoveNodeDto } from '@heartsync/types';
/**
 * 通用基础层级服务（抽象类）
 * 所有需要目录树功能的业务模块继承此类，仅需实现getRepository方法即可
 * @template T - 业务实体类型（必须实现ILevelNode接口）
 */
@Injectable()
export abstract class BaseLevelService<T extends ILevelNode> {
  /**
   * 抽象方法：获取当前业务实体的TypeORM仓库（子类必须实现）
   * @returns Repository<T>
   */
  protected abstract getRepository(): Repository<T>;

  /**
   * 校验：节点是否是目标父节点的子节点（避免循环引用）
   * @param nodeId 待检查节点ID
   * @param parentId 目标父节点ID
   * @returns boolean
   */
  private async isDescendant(
    nodeId: string,
    parentId: string,
  ): Promise<boolean> {
    const repo = this.getRepository();
    // 查询当前节点的直接子节点
    const childNodes = await repo.find({ where: { parentId: nodeId } as any });

    // 直接子节点包含目标父节点 → 循环引用
    if (childNodes.some((node) => node.id === parentId)) {
      return true;
    }

    // 递归检查子节点的子节点
    for (const child of childNodes) {
      if (await this.isDescendant(child.id, parentId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 通用方法：查询指定父节点下的所有子节点（按sort升序）
   * @param parentId 父节点ID（根节点传0）
   * @returns T[]
   */
  async getChildren(parentId: string): Promise<T[]> {
    const repo = this.getRepository();
    return repo.find({
      where: { parentId } as any,
      order: { sort: 'ASC' } as FindOptionsOrder<T>,
    });
  }

  /**
   * 通用方法：获取完整的目录树结构（递归构建）
   * @param parentId 根节点ID（默认0）
   * @returns T[]（包含children子节点）
   */
  async getFullTree(parentId: string): Promise<Array<T & { children?: T[] }>> {
    const repo = this.getRepository();
    // 查询当前父节点下的所有子节点
    const nodes = await repo.find({
      where: { parentId } as any,
      order: { sort: 'ASC' } as FindOptionsOrder<T>,
    });

    // 递归构建子节点树
    const treeNodes = await Promise.all(
      nodes.map(async (node) => {
        const children = await this.getFullTree(node.id);
        return { ...node, children: children.length > 0 ? children : [] };
      }),
    );

    return treeNodes;
  }

  /**
   * 通用方法：节点移动+排序（核心逻辑）
   * @param IMoveNodeDto 移动排序参数
   * @returns T 移动后的节点
   */
  async moveNode(IMoveNodeDto: IMoveNodeDto): Promise<T> {
    const { nodeId, targetParentId, sortStrategy } = IMoveNodeDto;
    const repo = this.getRepository();

    // 1. 校验待移动节点是否存在
    const targetNode = await repo.findOne({ where: { id: nodeId } as any });
    if (!targetNode) {
      throw new HttpException('待移动的节点不存在', HttpStatus.NOT_FOUND);
    }

    // 2. 校验目标父节点是否存在（根节点parentId=0除外）
    if (targetParentId !== null) {
      const targetParent = await repo.findOne({
        where: { id: targetParentId } as any,
      });
      if (!targetParent) {
        throw new HttpException('目标父节点不存在', HttpStatus.NOT_FOUND);
      }

      // 3. 校验：目标父节点是否允许有子节点
      if (targetParent.allowChildren === 0) {
        throw new HttpException(
          '该节点不允许添加子节点',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // 4. 校验循环引用（不能移动到自己的子节点下）
    if (await this.isDescendant(nodeId, targetParentId)) {
      throw new HttpException(
        '不能将节点移动到自己的子节点下（避免循环引用）',
        HttpStatus.BAD_REQUEST,
      );
    }

    let finalSortValue: number;

    // 5. 处理排序逻辑
    if (sortStrategy === 'by_adjacent_node') {
      const { adjacentNodeId, position } = IMoveNodeDto;
      // 校验相邻节点参数
      if (!adjacentNodeId || !position) {
        throw new HttpException(
          '指定相邻节点排序时，必须传adjacentNodeId和position',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 校验相邻节点是否存在
      const adjacentNode = await repo.findOne({
        where: { id: adjacentNodeId } as any,
      });
      if (!adjacentNode) {
        throw new HttpException('相邻节点不存在', HttpStatus.NOT_FOUND);
      }

      // 校验相邻节点和目标父节点同层级
      if (adjacentNode.parentId !== targetParentId) {
        throw new HttpException(
          '相邻节点必须和目标父节点同层级',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 计算临时排序值（避免冲突）
      finalSortValue =
        position === 'before'
          ? adjacentNode.sort - 0.5
          : adjacentNode.sort + 0.5;
    } else {
      // by_sort_value策略
      if (IMoveNodeDto.sortValue === undefined) {
        throw new HttpException(
          '指定排序值策略时，必须传sortValue',
          HttpStatus.BAD_REQUEST,
        );
      }
      finalSortValue = IMoveNodeDto.sortValue;
    }

    // 6. 更新节点的父节点、排序值、层级
    targetNode.parentId = targetParentId;
    targetNode.sort = finalSortValue;
    // 更新层级
    if (targetParentId === null) {
      targetNode.level = 1;
    } else {
      const targetParent = await repo.findOne({
        where: { id: targetParentId } as any,
      });
      targetNode.level = targetParent!.level + 1;
    }

    // 7. 规整目标父节点下的所有子节点排序值（改为连续整数）
    const sameParentNodes = await repo.find({
      where: { parentId: targetParentId } as any,
      order: { sort: 'ASC' } as FindOptionsOrder<T>,
    });
    // 批量更新排序值
    await Promise.all(
      sameParentNodes.map(async (node, index) => {
        node.sort = index + 1;
        await repo.save(node);
      }),
    );

    // 8. 保存当前节点并返回
    return repo.save(targetNode);
  }

  /**
   * 通用方法：创建节点（自动计算层级）
   * @param node 待创建的节点数据
   * @returns T
   */
  async createNode(node: Partial<T>): Promise<T> {
    const repo = this.getRepository();
    // 自动计算层级
    if (node.parentId === null || !node.parentId) {
      node.level = 1;
    } else {
      const parentNode = await repo.findOne({
        where: { id: node.parentId } as any,
      });
      if (!parentNode) {
        throw new HttpException('父节点不存在', HttpStatus.NOT_FOUND);
      }
      node.level = parentNode.level + 1;
    }
    // 默认排序值（同层级最后一位）
    if (!node.sort) {
      const sameParentNodes = await repo.find({
        where: { parentId: node.parentId || 0 } as any,
      });
      node.sort = sameParentNodes.length * 10 + 10;
    }
    // 默认节点类型（业务节点）
    if (node.nodeType === undefined) {
      node.nodeType = 1;
    }
    // 默认允许有子节点
    if (node.allowChildren === undefined) {
      node.allowChildren = 1;
    }
    return repo.save(node as T);
  }

  /**
   * 通用方法：删除节点（递归删除所有子节点）
   * @param nodeId 节点ID
   * @returns boolean
   */
  async deleteNode(nodeId: string): Promise<boolean> {
    const repo = this.getRepository();
    // 先递归删除所有子节点
    const children = await this.getChildren(nodeId);
    await Promise.all(children.map((child) => this.deleteNode(child.id)));
    // 删除当前节点
    await repo.delete(nodeId);
    return true;
  }
}
