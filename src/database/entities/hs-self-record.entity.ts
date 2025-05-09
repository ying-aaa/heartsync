import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('hs-self-record') // 指定表名为 hs-self-record
export class HsSelfRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true, default: [] })
  filesData: object;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  visibility: string; // 查看范围，例如：public, private

  @CreateDateColumn()
  createdAt: Date;
}
