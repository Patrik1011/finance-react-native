import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
    signUpDto.role = Role.USER; 
    return this.authService.signup(signUpDto);
  }

   @UseGuards(JwtAuthGuard)
   @Post('upgrade')
   upgrade(@Request() req) {
     return this.authService.upgrade(req.user.id);
   }
}
