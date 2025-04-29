import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageUploadService {
  private readonly apiKey: string;
  private readonly uploadUrl = 'https://freeimage.host/api/1/upload';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('IMG_API_KEY');
    if (!this.apiKey) {
      console.error('IMG_API_KEY environment variable is not set');
    }
  }

  async uploadImage(
    imageBase64: string,
    format = 'jpg',
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('key', this.apiKey);
      formData.append('action', 'upload');
      formData.append('source', imageBase64);
      formData.append('format', 'json');

      const response = await axios.post(this.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.status_code === 200 && response.data.success) {
        return {
          success: true,
          url: response.data.image.url,
        };
      } else {
        return {
          success: false,
          error: 'Image upload failed: ' + (response.data.error?.message || 'Unknown error'),
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Image upload failed: ${error.message}`,
      };
    }
  }

  cleanBase64Image(base64Image: string): string {
    if (base64Image.includes('base64,')) {
      return base64Image.split('base64,')[1];
    }
    return base64Image;
  }
}