import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(categoryDto: CategoryEntity): Promise<CategoryEntity> {
    const newCategory = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateCategoryDto: CategoryEntity,
  ): Promise<CategoryEntity> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
