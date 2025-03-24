import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async upgrade(userId: number) {
    return this.usersService.upgrade(userId);
  }

  async signup(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  async login(user: CreateUserDto) {
    const userFromDb = await this.usersService.findOne(user.username);

    const payload = {
      username: user.username,
      id: userFromDb.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
