import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from 'src/entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    creteCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const newCategory = this.categoryRepository.create({
      ...creteCategoryDto,
      user: { id: userId },
    });
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(userId: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findByCategoryId(id: number, userId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ): Promise<Category> {
    // First check if the category exists and belongs to the user
    const category = await this.findByCategoryId(id, userId);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.user.id !== userId) {
      throw new NotFoundException(
        `Category with ID ${id} does not belong to user with ID ${userId}`,
      );
    }

    // Update the category
    await this.categoryRepository.update(id, updateCategoryDto);

    // Return the updated category
    return this.findByCategoryId(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const category = await this.findByCategoryId(id, userId);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    if (category.user.id !== userId) {
      throw new NotFoundException(
        `Category with ID ${id} does not belong to user with ID ${userId}`,
      );
    }

    await this.categoryRepository.delete(id);
  }
}
