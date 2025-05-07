import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

@Entity()
export class HsCodeWidget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  templateHtml: string;

  @Column({ type: 'varchar', nullable: false })
  templateCss: string;

  @Column({ type: 'varchar', nullable: false })
  templateJs: string;

  @Column({ type: 'simple-json', nullable: true, default: [] })
  resourceScript: Array<IResourceScript>;
}
