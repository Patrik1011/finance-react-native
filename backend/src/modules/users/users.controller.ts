import { Controller, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upgrade')
  upgrade(@Request() req) {
    return this.usersService.upgradeToPremium(req.user.id);
  }
}
