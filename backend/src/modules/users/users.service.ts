import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/utils/enums';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) return null;

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    return this.userRepository.save({ username, password, role });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async upgradeToPremium(userId: number): Promise<User> {
    const user = await this.findUserById(userId);

    if (!user) throw new Error('User not found');

    if (user.role === Role.PREMIUM_USER) {
      throw new Error('User is already a premium user');
    }

    user.role = Role.PREMIUM_USER;

    return this.userRepository.save(user);
  }
}
