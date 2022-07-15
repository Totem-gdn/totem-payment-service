import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '../throttler/throttler.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { QUEUE_NAME } from './payment.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    ThrottlerModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
