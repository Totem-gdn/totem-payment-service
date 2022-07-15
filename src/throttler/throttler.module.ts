import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from './throttler-storage.service';
import { ThrottlerBehindProxyGuard } from './throttler.guards';

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 60,
        limit: 5,
        storage: new ThrottlerStorageRedisService(config.get<string>('redis.uri')),
      }),
    }),
  ],
  providers: [ThrottlerBehindProxyGuard],
  exports: [ThrottlerBehindProxyGuard],
})
export class ThrottlerModule {}
