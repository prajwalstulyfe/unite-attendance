import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for all frontends (admin, kiosk, app, web)
  const allowedOrigins = (process.env['CORS_ORIGINS'] || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // 2. Global Validation Pipe with automatic type transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 3. Start Server
  const port = process.env['API_PORT'] || 3001;
  await app.listen(port);

  logger.log(`🚀 Unite Attendance API running on: http://localhost:${port}`);
}

bootstrap();
