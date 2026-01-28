import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IAppMenuConfig,
  IMenuItemStyle,
  IMenuLogicConfig,
  IMenuShrinkConfig,
  IWhetherStatus,
} from '@heartsync/types';
import { Exclude } from 'class-transformer';

@Entity('hs_app_menu_config', { comment: '应用菜单配置表' })
@Index(['appId', 'versionId'], { unique: true })
export class HsAppMenuConfigEntity implements IAppMenuConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_id', type: 'varchar', length: 64, comment: '应用ID' })
  appId: string;

  @Column({
    name: 'version_id',
    type: 'varchar',
    length: 64,
    comment: '版本ID',
  })
  versionId: string;

  @Column({
    name: 'is_select_parent_when_child',
    type: 'smallint',
    default: 0,
    enum: IWhetherStatus,
    comment: '选中子菜单时，是否自动选中父元素',
  })
  isSelectParentWhenChild: number;

  @Column({
    name: 'logo_config',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => `'{}'`,
    comment: '菜单logo配置',
  })
  menuLogoConfig: IMenuLogicConfig;

  @Column({
    name: 'shrink_config',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => `'{}'`,
    comment: '菜单收缩配置',
  })
  menuShrinkConfig: IMenuShrinkConfig;

  @Column({
    name: 'parent_menu_item_style',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => `'{"default":{},"hover":{},"active":{}}'`,
    comment: '父菜单项样式',
  })
  parentMenuItemStyle: IMenuItemStyle;

  @Column({
    name: 'child_menu_item_style',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => `'{"default":{},"hover":{},"active":{}}'`,
    comment: '子菜单项样式',
  })
  childMenuItemStyle: IMenuItemStyle;

  @Column({
    name: 'menu_container_style',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'{}'",
    comment: '菜单容器样式',
  })
  menuContainerStyle: Record<string, string>;

  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @Exclude()
  @Column({
    name: 'is_deleted',
    type: 'smallint',
    default: 0,
    enum: IWhetherStatus,
    comment: '软删除：0-未删 1-已删',
  })
  isDeleted: IWhetherStatus;
}
