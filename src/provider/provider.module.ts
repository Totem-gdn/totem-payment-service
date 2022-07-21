import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProviderService } from './provider.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from '../consumers/consumers.constants';

@Module({
  imports: [ConfigModule, BullModule.registerQueue({ name: QUEUE_NAME.ASSETS })],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
