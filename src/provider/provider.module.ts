import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentProviderService } from './payment-provider.service';
import { NFTProviderService } from './nft-provider.service';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../consumers/consumers.constants';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({ name: QueueName.Assets }),
    BullModule.registerQueue({ name: QueueName.Payments }),
  ],
  providers: [PaymentProviderService, NFTProviderService],
  exports: [PaymentProviderService, NFTProviderService],
})
export class ProviderModule {}
