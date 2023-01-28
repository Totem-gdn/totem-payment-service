import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDetails, PaymentDetailsSchema } from './schemas/payment-details';
import { PaymentKeyClaim, PaymentKeyClaimSchema } from './schemas/payment-key-claim';
import { ProviderModule } from '../../provider/provider.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      { name: PaymentKeyClaim.name, schema: PaymentKeyClaimSchema },
    ]),
    ProviderModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
