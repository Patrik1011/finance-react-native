import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { User } from 'src/entities/user.entity';
import { Entry } from 'src/entities/entry.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Entry])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
