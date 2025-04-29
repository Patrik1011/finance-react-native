import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { EntriesModule } from './modules/entries/entries.module';
import { dbConfig } from '../db.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './loggers/logger.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { ImagesModule } from './modules/image-upload/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    CategoriesModule,
    EntriesModule,
    UsersModule,
    AuthModule,
    AdminModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
