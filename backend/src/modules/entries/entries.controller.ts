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

@Controller('entry')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  
}
