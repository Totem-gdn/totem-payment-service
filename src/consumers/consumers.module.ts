import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueName } from './consumers.constants';
import { AssetsConsumerService } from './assets-consumer.service';
import { MinterAssetsModule } from '../minter-service/minter-assets/minter-assets.module';
import { PaymentsConsumerService } from './payments-consumer.service';
import { MinterPaymentsModule } from '../minter-service/minter-payments/minter-payments.module';
import { ProviderModule } from '../provider/provider.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.Assets }),
    BullModule.registerQueue({ name: QueueName.Payments }),
    MinterAssetsModule,
    MinterPaymentsModule,
    ProviderModule,
  ],
  providers: [AssetsConsumerService, PaymentsConsumerService],
})
export class ConsumersModule {}
