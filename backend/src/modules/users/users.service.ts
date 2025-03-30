import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/utils/enums';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserDto)
    private userRepository: Repository<UserDto>,
  ) {}

  async findUserById(id: number): Promise<UserDto> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) return null;

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<UserDto>> {
    const { firstName, lastName, email, username, password, role } = createUserDto;
    return this.userRepository.save({
      first_name: firstName, 
      last_name: lastName, 
      email, 
      username, 
      password, 
      role 
    });
  }

  async findAll(): Promise<UserDto[]> {
    return this.userRepository.find();
  }

  async upgradeToPremium(userId: number): Promise<Partial<UserDto>> {
    const user = await this.findUserById(userId);

    if (!user) throw new Error('User not found');

    if (user.role === Role.PREMIUM_USER) {
      throw new Error('User is already a premium user');
    }

    user.role = Role.PREMIUM_USER;

    const updatedUser = await this.userRepository.save(user);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
    };
  }
}
