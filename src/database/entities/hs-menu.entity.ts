import {
  Entity,
  Column,
  PrimaryColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { HsBaseEntity } from './hs-base.entity';

export enum IMenuType {
  Parent = 'parent',
  Dashboard = 'dashboard',
  UrlRedirect = 'urlRedirect',
  AppRedirect = 'appRedirect',
}

@Entity('hs_menu')
@Tree('materialized-path')
export class HsMenuEntity extends HsBaseEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'icon' })
  icon: string;

  @Column({ type: 'enum', enum: IMenuType, name: 'menu_type' })
  menuType: IMenuType;

  @TreeParent({ onDelete: 'CASCADE' })
  parent?: HsMenuEntity;

  @Column({ nullable: true, name: 'parent_menu_id' })
  parentMenuId?: string;

  @Column({ default: false, name: 'is_fullscreen' })
  isFullscreen: boolean;

  @Column('int', { name: 'sort' })
  sort: number;

  @Column({ nullable: true, name: 'dashboard_id' })
  dashboardId?: string;

  // @Column({ nullable: true, name: 'url' })
  // url?: string;

  @Column({ nullable: true, name: 'app_id' })
  appId?: string;

  @Column({ nullable: true, name: 'external_link' })
  externalLink?: string;

  @Column({ default: true, name: 'visible' })
  visible: boolean;

  @Column('text', { array: true, nullable: true, name: 'auth_roles' })
  authRoles?: string[];

  @Column({ default: 1, name: 'version' })
  version: number;

  @TreeChildren({})
  children?: HsMenuEntity[];
}
