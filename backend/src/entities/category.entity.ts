import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EntryEntity } from './entry.entity';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  color: string;

  @OneToMany(() => EntryEntity, (entry) => entry.category)
  entries: EntryEntity[];
}
