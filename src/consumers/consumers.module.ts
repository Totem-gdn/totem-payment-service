import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from './consumers.constants';
import { AssetsConsumerService } from './assets-consumer.service';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAME.ASSETS })],
  providers: [AssetsConsumerService],
})
export class ConsumersModule {}
