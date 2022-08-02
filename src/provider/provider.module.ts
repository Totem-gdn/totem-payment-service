import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProviderService } from './provider.service';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../consumers/consumers.constants';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({ name: QueueName.Assets }),
    BullModule.registerQueue({ name: QueueName.Payments }),
  ],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
