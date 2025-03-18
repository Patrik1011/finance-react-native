import { Entry } from 'src/modules/entries/entity/entry.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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
