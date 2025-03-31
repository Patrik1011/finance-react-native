import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from 'src/entities/category.entity';
import { UserId } from '../auth/decorators/user-id.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PremiumUserGuard } from '../auth/guards/premium-user.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() categoryDto: CreateCategoryDto,
    @UserId() userId: number,
  ): Promise<Category> {
    return await this.categoriesService.create(categoryDto, userId);
  }

  @Get()
  @HttpCode(200)
  async findAll(@UserId() userId: number): Promise<Category[]> {
    console.log('categories');
    return await this.categoriesService.findAll(userId);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UserId() userId: number,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(PremiumUserGuard)
  async remove(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<void> {
    await this.categoriesService.remove(id, userId);
  }
}
