import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/utils/enums';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async upgrade(userId: number) {
    const user = await this.findUserById(userId);

    if (!user) throw new Error('User not found');

    user.role = Role.PREMIUM_USER;

    return this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findOne(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) return null;

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password, role } = createUserDto;
    return this.userRepository.save({ username, password, role }); //TODO: hash password
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
