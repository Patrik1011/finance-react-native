import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upgrade')
  @UseGuards(JwtAuthGuard)
  upgrade(@Req() req) {
    return this.usersService.upgradeToPremium(req.user.id);
  }

  @Post('downgrade')
  @UseGuards(JwtAuthGuard)
  downgrade(@Req() req) {
    return this.usersService.downgradeToBasic(req.user.id);
  }
}
