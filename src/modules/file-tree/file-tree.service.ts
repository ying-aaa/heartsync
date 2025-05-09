import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';
import {
  HsFileNode,
  NodeType,
} from '../../database/entities/hs-file-node.entity';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { MoveNodeDto } from './dto/move-node.dto';

@Injectable()
export class HsFileTreeService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(HsFileNode)
    private repo: Repository<HsFileNode>,
  ) {}

  async create(dto: CreateNodeDto): Promise<HsFileNode> {
    return this.dataSource.transaction(async (manager) => {
      // 查询目标父目录
      if (dto.parentId) {
        const parentData = await manager.findOne(HsFileNode, {
          where: {
            id: dto.parentId,
          },
        });

        // 检查目标父目录是否存在
        if (!parentData) throw new NotFoundException('目标父目录不存在');

        // 检查目标父目录的类型是否为 'file'
        if (parentData.type === NodeType.FILE) {
          throw new BadRequestException('无法创建至非目录下！');
        }
      }

      // 检查同级节点名称唯一性
      const existing = await manager.findOne(HsFileNode, {
        where: {
          businessId: dto.businessId,
          businessKey: dto.businessKey ?? IsNull(),
          parentId: dto.parentId ?? IsNull(),
          name: dto.name,
          type: dto.type,
        },
      });

      if (existing) {
        throw new ConflictException('同一目录下重复的节点名称');
      }

      // 创建新节点
      const node = manager.create(HsFileNode, {
        ...dto,
        hasChildren: false,
      });

      const data = await manager.save(node);

      // 更新父节点状态
      if (dto.parentId) {
        await this.refreshParentStatus(manager, dto.parentId);
      }

      return data;
    });
  }

  async getNodeById(id: string): Promise<HsFileNode> {
    const nodeData = await this.repo.findOneBy({ id });
    if (!nodeData) {
      throw new NotFoundException(`没有找到相关节点 ${id}`);
    }
    return nodeData;
  }

  async update(id: string, dto: UpdateNodeDto): Promise<HsFileNode> {
    return this.dataSource.transaction(async (manager) => {
      const node = await manager.findOneBy(HsFileNode, { id });
      if (!node) throw new NotFoundException();

      // 重命名时检查同名
      if (dto.name && dto.name !== node.name) {
        const existing = await manager.findOne(HsFileNode, {
          where: {
            businessId: node.businessId,
            businessKey: node.businessKey || IsNull(),
            parentId: node.parentId || IsNull(),
            name: dto.name,
          },
        });
        if (existing) throw new ConflictException('重复名称');
      }

      return manager.save(HsFileNode, { ...node, ...dto });
    });
  }

  async move(id: string, dto: MoveNodeDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const node = await manager.findOneBy(HsFileNode, { id });
      if (!node) throw new NotFoundException();

      if (dto.newParentId) {
        // 查询目标父目录
        const newParent = await manager.findOne(HsFileNode, {
          where: {
            id: dto.newParentId,
          },
        });

        // 检查目标父目录是否存在
        if (!newParent) throw new NotFoundException('目标父目录不存在');

        // 检查目标父目录的类型是否为 'file'
        if (newParent.type === NodeType.FILE) {
          throw new BadRequestException('无法移入至非目录下！');
        }
      }

      // 检查目标位置是否存在同名
      const existing = await manager.findOne(HsFileNode, {
        where: {
          businessId: dto.businessId,
          businessKey: dto.businessKey || IsNull(),
          parentId: dto.newParentId ?? IsNull(),
          name: node.name,
        },
      });
      if (existing) throw new ConflictException('目标中的重复名称');

      // 记录原父节点
      const originalParent = node.parentId;

      // 执行移动
      node.parentId = dto.newParentId ?? null;
      await manager.save(node);

      // 更新新旧父节点状态
      await this.refreshParentStatus(manager, originalParent);
      await this.refreshParentStatus(manager, dto.newParentId);
    });
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const node = await manager.findOne(HsFileNode, {
        where: { id },
      });

      if (!node) throw new NotFoundException('未找到要删除的节点！');

      // 检查是否有子节点
      if (node.hasChildren) {
        throw new ConflictException('不能删除带有子目录的目录');
      }

      // 删除节点
      await manager.remove(node);

      // 更新父节点状态
      if (node.parentId) {
        await this.refreshParentStatus(manager, node.parentId);
      }
    });
  }

  async getEntireTree(BusinessParams: object): Promise<any[]> {
    // 获取所有节点（按父级排序优化树构建）
    const allNodes = await this.repo.find({
      where: BusinessParams,
      order: { parentId: 'ASC' },
    });

    // 构建树结构
    return this.buildTree(allNodes);
  }

  private buildTree(nodes: any[], parentId: number | null = null): any[] {
    return nodes
      .filter((node) => node.parentId === parentId)
      .map((node) => ({
        ...node,
        text: node.name,
        children: this.buildTree(nodes, node.id),
      }));
  }

  async getChildren(
    parentId: string | null,
    BusinessParams: object,
  ): Promise<HsFileNode[]> {
    return this.repo.find({
      where: {
        ...BusinessParams,
        parentId: parentId ?? null,
      },
      order: {
        type: 'DESC', // 目录在前
        name: 'ASC',
      },
    });
  }

  private async refreshParentStatus(
    manager: EntityManager,
    parentId?: string,
  ): Promise<void> {
    if (!parentId) return;

    const count = await manager.count(HsFileNode, {
      where: { parentId },
    });

    await manager.update(HsFileNode, parentId, {
      hasChildren: count > 0,
    });
  }
}
