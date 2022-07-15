import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.enableCors({ origin: true });
  await app.listen(config.get<number>('port'));
}

void bootstrap();
