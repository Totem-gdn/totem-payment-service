import { Module } from '@nestjs/common';
import { ProviderModule } from '../provider/provider.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [ProviderModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
