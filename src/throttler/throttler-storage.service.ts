import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as IORedis from 'ioredis';
import { ThrottlerStorageRedis } from './throttler-storage.inderface';

@Injectable()
export class ThrottlerStorageRedisService implements ThrottlerStorageRedis, OnModuleDestroy {
  redis: IORedis.Redis;
  disconnectRequired?: boolean;
  scanCount: number;

  constructor(redis?: IORedis.Redis, scanCount?: number);
  constructor(options?: IORedis.RedisOptions, scanCount?: number);
  constructor(url?: string, scanCount?: number);
  constructor(redisOrOptions?: IORedis.Redis | IORedis.RedisOptions | string, scanCount?: number) {
    this.scanCount = typeof scanCount === 'undefined' ? 1000 : scanCount;

    if (redisOrOptions instanceof IORedis) {
      this.redis = redisOrOptions;
    } else if (typeof redisOrOptions === 'string') {
      this.redis = new IORedis(redisOrOptions as string);
      this.disconnectRequired = true;
    } else {
      this.redis = new IORedis(redisOrOptions);
      this.disconnectRequired = true;
    }
  }

  async getRecord(key: string): Promise<number[]> {
    const ttls = (
      await this.redis.scan(0, 'MATCH', `${this.redis?.options?.keyPrefix}${key}:*`, 'COUNT', this.scanCount)
    ).pop();
    return (ttls as string[]).map((k) => parseInt(k.split(':').pop())).sort();
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    await this.redis.set(`${key}:${Date.now() + ttl * 1000}`, ttl, 'EX', ttl);
  }

  onModuleDestroy() {
    if (this.disconnectRequired) {
      this.redis?.disconnect(false);
    }
  }
}
