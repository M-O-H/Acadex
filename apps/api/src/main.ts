import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidateHeadersInterceptor } from './common/interceptors/validate-headers.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ValidateHeadersInterceptor(),
    new LoggingInterceptor(),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  const logger = new Logger('bootstrap');
  logger.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
