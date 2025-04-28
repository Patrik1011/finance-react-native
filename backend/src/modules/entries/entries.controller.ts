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
  Req,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from 'src/entities/entry.entity';
import { Category } from 'src/entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PremiumUser } from '../auth/decorators/premium-user.decorator';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async create(@Body() entryDto: CreateEntryDto): Promise<Entry> {
    return await this.entriesService.create(entryDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req): Promise<Entry[]> {
    return await this.entriesService.findAllByUser(req.user.id);
  }

  @Get('category/:categoryId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getEntriesByCategory(
    @Param('categoryId') id: number,
  ): Promise<{ category: Category; entries: Entry[] }> {
    return await this.entriesService.getEntriesByCategory(id);
  }

  @Put(':id')
  @HttpCode(200)
  @PremiumUser()
  async update(
    @Param('id') id: number,
    @Body() updateEntryDto: Partial<CreateEntryDto>,
  ): Promise<Entry> {
    return await this.entriesService.update(id, updateEntryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    await this.entriesService.remove(id);
  }
}
