import { Controller } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}
}
