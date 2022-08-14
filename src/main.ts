import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // whitelist: true - strips non dto properties from request body
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(3000);
}
bootstrap();
