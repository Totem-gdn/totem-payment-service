import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import configuration from './config/configuration';
import { AssetsModule } from './controllers/assets/assets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './controllers/health/health.module';
import { PaymentsModule } from './controllers/payments/payments.module';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        dbName: configService.get<string>('mongodb.database'),
      }),
      inject: [ConfigService],
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
    PaymentsModule,
  ],
})
export class AppModule {}
