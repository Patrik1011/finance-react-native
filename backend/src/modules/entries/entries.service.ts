import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entry.dto';
import { EntryEntity } from 'src/entities/entry.entity';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(EntryEntity)
    private readonly entryRepository: Repository<EntryEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<EntryEntity> {
    const { title, amount, categoryId } = createEntryDto;
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    const entry = this.entryRepository.create({
      title,
      amount,
      categoryId: category.id,
    });
    return await this.entryRepository.save(entry);
  }

  async findAll(): Promise<EntryEntity[]> {
    return await this.entryRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<EntryEntity> {
    return await this.entryRepository.findOneBy({ id });
  }

  async getEntriesByCategory(
    categoryId: number,
  ): Promise<{ category: CategoryEntity; entries: EntryEntity[] }> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const entries = await this.entryRepository.find({
      where: { category: { id: categoryId } },
    });

    return {
      category: category,
      entries,
    };
  }

  async update(
    id: number,
    updateEntryDto: Partial<CreateEntryDto>,
  ): Promise<EntryEntity> {
    const { categoryId, ...updateData } = updateEntryDto;

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new Error('Category not found');
      }
      await this.entryRepository.update(id, { ...updateData, category });
    } else {
      await this.entryRepository.update(id, updateData);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.entryRepository.delete(id);
  }
}
