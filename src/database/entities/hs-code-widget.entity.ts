import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import { Entity, Column } from 'typeorm';

export interface IResourceScript {
  resourceUrl: string;
  isModule: boolean;
}

export interface ICodeWidgetConfig {
  id: string;
  templateHtml: string;
  templateCss: string;
  templateJs: string;
  resourceScript: Array<IResourceScript>;
}

@Entity('hs_code_widget', { comment: '代码部件表' })
export class HsCodeWidgetEntity extends HsBaseEntity {
  @Column({ name: 'widget_id', type: 'varchar', nullable: false })
  widgetId;

  @Column({
    name: 'template_html',
    type: 'varchar',
    nullable: true,
    default: '',
  })
  templateHtml: string;

  @Column({
    name: 'template_css',
    type: 'varchar',
    nullable: true,
    default: '#container{color: green}',
  })
  templateCss: string;

  @Column({
    name: 'template_js',
    type: 'varchar',
    nullable: true,
    default: 'return class extends DynamicWidgetComponent  {  }',
  })
  templateJs: string;

  @Column({
    name: 'resource_script',
    type: 'simple-json',
    nullable: true,
    default: [],
  })
  resourceScript: Array<IResourceScript>;

  constructor() {
    super();
    this.templateHtml = `<div id="container">你好世界</div>` + this.id; // 自动生成 UUID
  }
}
