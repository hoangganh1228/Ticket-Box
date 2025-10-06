import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter-exceptions/http-exception.filter';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin for static files
    }),
  );
  app.use(cookieParser())
  app.enableCors({ origin: true, credentials: true });
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidUnknownValues: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }))
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
