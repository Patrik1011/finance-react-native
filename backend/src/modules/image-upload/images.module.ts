import { Module } from '@nestjs/common';
import { ImageUploadService } from './images.services';
import { ImagesController } from './images.controller';

@Module({
  controllers: [ImagesController],
  providers: [ImageUploadService],
  exports: [ImageUploadService],
})
export class ImagesModule {}