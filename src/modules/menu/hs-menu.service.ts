import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import {
  CreateHsMenuDto,
  BatchUpdateHsMenuDto,
  UpdateHsMenuDto,
  ReorderHsMenuDto,
} from './dot/hs-menu.dto';
import { HsMenuEntity } from 'src/database/entities/hs-menu.entity';

@Injectable()
export class HsMenuService {
  constructor(
    @InjectRepository(HsMenuEntity)
    private menuRepo: Repository<HsMenuEntity>,
    @InjectRepository(HsMenuEntity)
    private treeRepo: TreeRepository<HsMenuEntity>,
  ) {}

  // 创建单个菜单
  async create(createDto: CreateHsMenuDto): Promise<HsMenuEntity> {
    const menu = this.menuRepo.create(createDto);
    if (createDto.parentMenuId) {
      menu.parent = await this.menuRepo.findOneBy({
        id: createDto.parentMenuId,
      });
    }
    return this.menuRepo.save(menu);
  }

  async getByAppId(appId: string): Promise<HsMenuEntity[]> {
    // 1. 找到所有关联该应用的菜单项
    const appMenus = await this.menuRepo.find({
      where: { appId },
      relations: ['parent'],
    });

    if (appMenus.length === 0) {
      return [];
    }

    const menuIds = new Set<string>();
    for (const menu of appMenus) {
      menuIds.add(menu.id);

      let current = menu.parent;
      while (current) {
        menuIds.add(current.id);
        current = await this.menuRepo
          .findOne({
            where: { id: current.id },
            relations: ['parent'],
          })
          .then((m) => m?.parent);
      }
    }

    const fullTree = await this.treeRepo.findTrees();

    const filterTree = (nodes: HsMenuEntity[]): HsMenuEntity[] => {
      return nodes
        .filter((node) => menuIds.has(node.id))
        .map((node) => ({
          ...node,
          children: node.children ? filterTree(node.children) : [],
        }));
    };

    return filterTree(fullTree);
  }

  async getById(id: string): Promise<HsMenuEntity> {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  // 批量更新整个菜单树
  async batchUpdate(batchDto: BatchUpdateHsMenuDto): Promise<HsMenuEntity[]> {
    await this.menuRepo.clear();
    const menus = batchDto.menus.map((dto) => this.menuRepo.create(dto));

    // 建立父子关系
    const menuMap = new Map(menus.map((menu) => [menu.id, menu]));
    menus.forEach((menu) => {
      if (menu.parentMenuId && menuMap.has(menu.parentMenuId)) {
        menu.parent = menuMap.get(menu.parentMenuId);
      }
    });

    return this.menuRepo.save(menus);
  }

  // 获取完整菜单树
  async getFullTree(): Promise<HsMenuEntity[]> {
    return this.treeRepo.findTrees();
  }

  // 按需加载子菜单
  async getChildren(parentId?: string): Promise<HsMenuEntity[]> {
    if (!parentId) {
      return this.treeRepo.findRoots();
    }

    const parent = await this.menuRepo.findOneBy({ id: parentId });
    if (!parent) throw new NotFoundException('未找到父菜单');

    return this.treeRepo.findDescendants(parent, { depth: 1 });
  }

  // 更新单个菜单
  async update(id: string, updateDto: UpdateHsMenuDto): Promise<HsMenuEntity> {
    const menu = await this.menuRepo.preload({ id, ...updateDto });
    if (!menu) throw new NotFoundException('未找到菜单');

    if (updateDto.parentMenuId) {
      menu.parent = await this.menuRepo.findOneBy({
        id: updateDto.parentMenuId,
      });
    }

    return this.menuRepo.save(menu);
  }

  // 删除菜单及其子树
  async delete(id: string): Promise<void> {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException('Menu not found');

    await this.menuRepo.remove(menu);
  }

  // 菜单排序
  async reorder(reorderDto: ReorderHsMenuDto): Promise<HsMenuEntity[]> {
    const { parentMenuId, orderedIds } = reorderDto;
    const parent = parentMenuId
      ? await this.menuRepo.findOneBy({ id: parentMenuId })
      : null;

    const children = parent
      ? await this.treeRepo.findDescendants(parent, { depth: 1 })
      : await this.treeRepo.findRoots();

    // 更新排序值
    children.forEach((child) => {
      child.sort = orderedIds.indexOf(child.id);
    });

    return this.menuRepo.save(children);
  }
}
