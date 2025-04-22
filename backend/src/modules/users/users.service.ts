import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/utils/enums';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) return null;

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<UserDto>> {
    const { firstName, lastName, email, username, password, role } =
      createUserDto;
    return this.userRepository.save({
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password,
      role,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async upgradeToPremium(userId: number): Promise<Partial<UserDto>> {
    const user = await this.findUserById(userId);

    if (!user) throw new Error('User not found');

    if (user.role === Role.PremiumUser) {
      throw new Error('User is already a premium user');
    }

    user.role = Role.PremiumUser;

    const updatedUser = await this.userRepository.save(user);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
    };
  }

  async downgradeToBasic(userId: number): Promise<Partial<UserDto>> {
    const user = await this.findUserById(userId);

    console.log('user', user);

    if (!user) throw new Error('User not found');

    if (user.role === Role.User) {
      throw new Error('User is already a basic user');
    }

    user.role = Role.User;

    const updatedUser = await this.userRepository.save(user);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
    };
  }
}
