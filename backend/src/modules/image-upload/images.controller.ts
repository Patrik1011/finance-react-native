import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadService } from './images.services';
import { ImageUploadDto } from './dto/image-upload.dto';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async uploadImage(@Body() uploadDto: ImageUploadDto) {
    const cleanBase64 = this.imageUploadService.cleanBase64Image(uploadDto.image);
    
    const result = await this.imageUploadService.uploadImage(
      cleanBase64,
      uploadDto.format || 'jpg',
    );

    if (result.success) {
      return {
        success: true,
        url: result.url,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  }
}