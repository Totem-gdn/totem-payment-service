import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { AppVersion } from './app.version';

async function bootstrap() {
  await AppVersion();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.enableShutdownHooks();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.enableCors({ origin: true });
  await app.init();
  await app.listen(config.get<number>('port'));
  Logger.log(`🚀 Application is running on: http://localhost:${config.get<number>('port')}`);
}

void bootstrap();
