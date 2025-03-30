import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  isValidPassword,
  isValidUsername,
} from 'src/utils/credentials-validator';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSignupDto } from './dto/user-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: UserSignupDto) {
    try {
      if (!isValidUsername(signupDto.username)) {
        throw new BadRequestException('Invalid email format');
      }

      if (!isValidPassword(signupDto.password)) {
        throw new BadRequestException(
          'Password must contain at least 6 characters, including uppercase, lowercase, number',
        );
      }

      const { username, password, role } = signupDto;

      const userExists = await this.usersService.findOne(username);
      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.usersService.create({
        username,
        password: hashedPassword,
        role,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: UserLoginDto) {
    const { username, password } = loginDto;

    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = {
      username: user.username,
      id: user.id,
      roles: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        roles: user.role,
      },
    };
  }

  async upgrade(userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.upgradeToPremium(userId);

    const updatedUser = await this.usersService.findUserById(userId);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      roles: updatedUser.role,
    };
  }
}
