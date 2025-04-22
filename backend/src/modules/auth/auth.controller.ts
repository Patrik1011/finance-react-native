import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { Role } from 'src/utils/enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  signup(@Body() signUpDto: UserSignupDto) {
    signUpDto.role = Role.User;
    return this.authService.signup(signUpDto);
  }

  @Post('create-admin')
  createAdmin(@Body() signUpDto: UserSignupDto) {
    signUpDto.role = Role.Admin;
    return this.authService.signup(signUpDto);
  }
}
