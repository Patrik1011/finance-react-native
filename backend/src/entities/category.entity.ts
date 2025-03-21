import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Entry } from './entry.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  color: string;

  @OneToMany(() => Entry, (entry) => entry.category)
  entries: Entry[];
}
