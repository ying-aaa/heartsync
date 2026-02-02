import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import { Entity, Column } from 'typeorm';
import {
  ICodeWidgetConfig,
  ICodeWidgetSubTypes,
  IResourceScript,
  IWidgetSettings,
  IWidgetType,
} from '@heartsync/types';
@Entity('hs_code_widget', { comment: '代码部件表' })
export class HsCodeWidgetEntity
  extends HsBaseEntity
  implements ICodeWidgetConfig
{
  @Column({ name: 'name', type: 'varchar', nullable: false, comment: '名称' })
  name: string;

  @Column({ name: 'app_id', type: 'varchar', length: 64, comment: '应用ID' })
  appId: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: IWidgetType,
    nullable: false,
    comment: '部件类型',
  })
  type: IWidgetType;

  @Column({
    name: 'sub_type',
    type: 'varchar',
    nullable: true,
    default: ICodeWidgetSubTypes.ANGULAR,
    comment: '表单类型',
  })
  subType: ICodeWidgetSubTypes;

  @Column({
    name: 'settings',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    comment: '部件设置',
    default: () => "'{}'",
  })
  settings: IWidgetSettings;

  @Column({
    name: 'template_html',
    type: 'varchar',
    nullable: true,
    default: '',
    comment: '模板html',
  })
  templateHtml: string;

  @Column({
    name: 'template_css',
    type: 'varchar',
    nullable: true,
    default: '#container{color: green}',
    comment: '模板css',
  })
  templateCss: string;

  @Column({
    name: 'template_js',
    type: 'varchar',
    nullable: true,
    default: 'return class extends DynamicWidgetComponent  {  }',
    comment: '模板js',
  })
  templateJs: string;

  @Column({
    name: 'resource_script',
    type: 'simple-json',
    nullable: true,
    default: [],
    comment: '模板资源脚本',
  })
  resourceScript: Array<IResourceScript>;

  constructor() {
    super();
    this.templateHtml = `<div id="container">你好世界</div>` + this.id; // 自动生成 UUID
  }
}
