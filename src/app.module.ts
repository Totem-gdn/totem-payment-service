import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import configuration from './config/configuration';
import { AssetsModule } from './api/assets/assets.module';
import { HealthModule } from './api/health/health.module';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.get<string>('redis.uri'),
        prefix: 'psmq', // minter-assets service message queue
      }),
    }),
    ConsumersModule,
    HealthModule,
    AssetsModule,
  ],
})
export class AppModule {}
