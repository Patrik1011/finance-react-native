import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { Entry } from 'src/entities/entry.entity';
import { Category } from 'src/entities/category.entity';
import { ImagesModule } from '../image-upload/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Entry, Category]), ImagesModule],
  controllers: [EntriesController],
  providers: [EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}
