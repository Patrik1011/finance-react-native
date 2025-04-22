import { Injectable } from '@nestjs/common';
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

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
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
      category_id: category.id,
    });
    return await this.entryRepository.save(entry);
  }

  async findOne(id: number): Promise<Entry> {
    return await this.entryRepository.findOneBy({ id });
  }

  async getEntriesByCategory(
    categoryId: number,
  ): Promise<{ category: Category; entries: Entry[] }> {
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
  ): Promise<Entry> {
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

