import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db/db.service';
import { CategoryModule } from './modules/category/categories.module';
import { Category } from './modules/category/entity/category.entity';
import { Entry } from './modules/entries/entity/entry.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Entry]),
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
