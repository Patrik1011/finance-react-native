import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  console.log('Application starting up...');
  const app = await NestFactory.create(AppModule);

  app.use(json({limit: '50mb'}))
  app.use(urlencoded({limit: '50mb', extended: true}))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
