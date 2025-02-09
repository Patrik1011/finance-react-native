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
import { CategoryEntity } from '../../entity/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() categoryDto: CategoryEntity): Promise<CategoryEntity> {
    return await this.categoryService.create(categoryDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryService.findAll();
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: CategoryEntity,
  ): Promise<CategoryEntity> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.categoryService.remove(id);
  }
}
