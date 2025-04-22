import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {
    console.log('CategoryController instantiated');
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const userId = req.user.id;

    return await this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findAllByUserId(@Req() req): Promise<Category[]> {
    const userId = req.user.id;
    return await this.categoryService.findAllByUserId(userId);
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: Category,
  ): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    await this.categoryService.remove(id);
  }
}