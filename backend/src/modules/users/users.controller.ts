import { Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserId } from '../auth/decorators/user-id.decorator';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upgrade')
  upgrade(@Request() req) {
   return this.usersService.upgradeToPremium(req.user.id);
  }

  @Post('downgrade')
  downgrade(@Request() req) {
    return this.usersService.downgradeToBasic(req.user.id);
  }

   @Get()
    @HttpCode(200)
    async findAll(@UserId() userId: number): Promise<User> {
      return await this.usersService.findUserById(userId);
    }
}
