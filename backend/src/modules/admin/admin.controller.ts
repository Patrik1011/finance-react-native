import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'src/entities/user.entity';
import { Admin } from '../auth/decorators/admin.decorator';

@Controller('admin')
@Admin()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async usersGetAll(): Promise<User[]> {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  async usersGetById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.adminService.findUserById(id);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async usersDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.adminService.deleteUser(id);
  }
}
