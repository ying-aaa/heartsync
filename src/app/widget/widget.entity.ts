import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Widget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  key: string;

  @Column()
  type: string;

  @Column('jsonb')
  config: any;
}
