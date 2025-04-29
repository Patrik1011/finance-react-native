import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => Category, (category) => category.entries)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ nullable: false })
  category_id: number;

  @Column({ nullable: true })
  image_url: string;
}
