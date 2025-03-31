import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/utils/enums';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from '../auth/auth.service';

//Circular dependency what is this?
// Circular dependency is when two or more modules depend on each other directly or indirectly.

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
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

  async upgradeToPremium(userId: number) {
    const user = await this.findUserById(userId);

    if (!user) throw new Error('User not found');

    if (user.role === Role.PREMIUM_USER) {
      throw new Error('User is already a premium user');
    }

    user.role = Role.PREMIUM_USER;

    const updatedUser = await this.userRepository.save(user);

    // Generate new token with updated role
    return this.authService.generateToken(updatedUser);
  }

  async downgradeToBasic(userId: number) {
    const user = await this.findUserById(userId);

    if (!user) throw new Error('User not found');

    if (user.role === Role.USER) {
      throw new Error('User is already a basic user');
    }

    user.role = Role.USER;

    const updatedUser = await this.userRepository.save(user);

    // Generate new token with updated role
    return this.authService.generateToken(updatedUser);
  }
}
