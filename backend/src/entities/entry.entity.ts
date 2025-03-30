import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity()
export class EntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => CategoryEntity, (category) => category.entries)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column({ nullable: false })
  categoryId: number;
}
