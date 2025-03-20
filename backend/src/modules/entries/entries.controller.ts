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
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from './entity/entry.entity';
import { Category } from '../category/entity/category.entity';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() entryDto: CreateEntryDto): Promise<Entry> {
    return await this.entriesService.create(entryDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Entry[]> {
    console.log('categories');
    return await this.entriesService.findAll();
  }

  @Get('category/:categoryId')
  @HttpCode(200)
  async getEntriesByCategory(
    @Param('categoryId') id: number,
  ): Promise<{ category: Category; entries: Entry[] }> {
    return await this.entriesService.getEntriesByCategory(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() updateEntryDto: Partial<CreateEntryDto>,
  ): Promise<Entry> {
    return await this.entriesService.update(id, updateEntryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.entriesService.remove(id);
  }
}
