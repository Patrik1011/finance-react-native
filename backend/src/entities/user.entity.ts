import { Role } from 'src/utils/enums';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: [Role.User],
  })
  role: Role;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
}
