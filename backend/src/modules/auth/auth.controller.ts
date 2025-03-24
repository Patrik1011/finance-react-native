import { Controller, Post, UseGuards, Request, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSignupDto } from './dto/user-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  upgrade(@Request() req) {
    return this.authService.upgrade(req.user.id);
  }

  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    
    return this.authService.login(loginDto);
  }

  @Post("signup")
  signup(@Body() signUpDto: UserSignupDto) {
    return this.authService.signup(signUpDto);
  }
}
