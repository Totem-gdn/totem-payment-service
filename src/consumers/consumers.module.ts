import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueName } from './consumers.constants';
import { AssetsConsumerService } from './assets-consumer.service';
import { PaymentsConsumerService } from './payments-consumer.service';
import { ProviderModule } from '../provider/provider.module';
import { PaymentsModule } from '../controllers/payments/payments.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.Assets }),
    BullModule.registerQueue({ name: QueueName.Payments }),
    ProviderModule,
    PaymentsModule,
  ],
  providers: [AssetsConsumerService, PaymentsConsumerService],
})
export class ConsumersModule {}
