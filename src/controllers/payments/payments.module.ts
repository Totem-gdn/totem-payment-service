import { Module } from '@nestjs/common';
import { MinterPaymentsModule } from '../../minter-service/minter-payments/minter-payments.module';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [MinterPaymentsModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
