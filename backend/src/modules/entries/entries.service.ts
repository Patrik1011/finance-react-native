import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from 'src/entities/entry.entity';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createEntryDto: CreateEntryDto, userId: number): Promise<Entry> {
    const { title, amount, categoryId } = createEntryDto;
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
      relations: ['user'],
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found or doesn't belong to user`);
    }
    
    const entry = this.entryRepository.create({
      title,
      amount,
      category_id: category.id,
      user_id: userId,
    });
    
    return await this.entryRepository.save(entry);
  }

  async findAll(userId: number): Promise<Entry[]> {
    return await this.entryRepository.find({ 
      where: { user_id: userId },
      relations: ['category'] 
    });
  }

  async findOne(id: number, userId: number): Promise<Entry> {
    const entry = await this.entryRepository.findOne({
      where: { id, user_id: userId },
      relations: ['category'],
    });
    
    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found or doesn't belong to user`);
    }
    
    return entry;
  }

  async getEntriesByCategory(
    categoryId: number,
    userId: number,
  ): Promise<{ category: Category; entries: Entry[] }> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found or doesn't belong to user`);
    }

    const entries = await this.entryRepository.find({
      where: { category_id: categoryId, user_id: userId },
      relations: ['category'],
    });

    return {
      category: category,
      entries,
    };
  }

  async update(
    id: number,
    updateEntryDto: Partial<CreateEntryDto>,
    userId: number,
  ): Promise<Entry> {
    await this.findOne(id, userId);
    
    const { categoryId, ...updateData } = updateEntryDto;

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, user: { id: userId } },
        relations: ['user'],
      });
      
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found or doesn't belong to user`);
      }
      
      await this.entryRepository.update(
        { id, user_id: userId },
        { ...updateData, category, category_id: categoryId }
      );
    } else {
      await this.entryRepository.update({ id, user_id: userId }, updateData);
    }

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const entry = await this.findOne(id, userId);
    
    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found or doesn't belong to user`);
    }
    
    await this.entryRepository.delete({ id, user_id: userId });
  }
}