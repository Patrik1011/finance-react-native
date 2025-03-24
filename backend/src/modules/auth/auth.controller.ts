import {
  Controller,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  upgrade(@Request() req) {
      return this.authService.upgrade(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  
  @Post('signup')
  async signup(@Request() req) {
    return this.authService.signup(req.body);
  }
}
