import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() categoryDto: Category): Promise<Category> {
    return await this.categoryService.create(categoryDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: Category,
  ): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.categoryService.remove(id);
  }
}
