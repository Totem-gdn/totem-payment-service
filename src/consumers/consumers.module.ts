import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from './consumers.constants';
import { AssetsConsumerService } from './assets-consumer.service';
import { MinterAssetsModule } from '../minter-service/minter-assets/minter-assets.module';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAME.ASSETS }), MinterAssetsModule],
  providers: [AssetsConsumerService],
})
export class ConsumersModule {}
