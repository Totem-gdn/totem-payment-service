import { Module } from '@nestjs/common';
import { ThrottlerModule } from '../throttler/throttler.module';
import { ProviderModule } from '../provider/provider.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [ThrottlerModule, ProviderModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
