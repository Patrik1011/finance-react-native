import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newCategory = {
      title: createCategoryDto.title,
      description: createCategoryDto.description,
      color: createCategoryDto.color,
      user_id: user.id,
    };

    return await this.categoryRepository.save(newCategory);
  }

  async findAllByUserId(userId: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { user: { id: userId } },
      // relations: ['user']
    });
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCategoryDto: Category): Promise<Category> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}

