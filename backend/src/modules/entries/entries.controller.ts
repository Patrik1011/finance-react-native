import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from 'src/entities/entry.entity';
import { Category } from 'src/entities/category.entity';
import { UserId } from '../auth/decorators/user-id.decorator';
import { PremiumUserGuard } from '../auth/guards/premium-user.guard';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() entryDto: CreateEntryDto,
    @UserId() userId: number,
  ): Promise<Entry> {
    return await this.entriesService.create(entryDto, userId);
  }

  @Get()
  @HttpCode(200)
  async findAll(@UserId() userId: number): Promise<Entry[]> {
    return await this.entriesService.findAll(userId);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<Entry> {
    return await this.entriesService.findOne(id, userId);
  }

  @Get('category/:categoryId')
  @HttpCode(200)
  async getEntriesByCategory(
    @Param('categoryId') id: number,
    @UserId() userId: number,
  ): Promise<{ category: Category; entries: Entry[] }> {
    return await this.entriesService.getEntriesByCategory(id, userId);
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(PremiumUserGuard)
  async update(
    @Param('id') id: number,
    @Body() updateEntryDto: Partial<CreateEntryDto>,
    @UserId() userId: number,
  ): Promise<Entry> {
    return await this.entriesService.update(id, updateEntryDto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(PremiumUserGuard)
  async remove(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<void> {
    await this.entriesService.remove(id, userId);
  }
}