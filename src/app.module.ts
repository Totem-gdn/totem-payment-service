import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { PaymentModule } from './payment/payment.module';
import { BullModule } from '@nestjs/bull';
import { HealthModule } from './health/health.module';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        url: config.get<string>('redis.uri'),
        prefix: 'psmq', // payment service message queue
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    ConsumersModule,
    PaymentModule,
  ],
})
export class AppModule {}
