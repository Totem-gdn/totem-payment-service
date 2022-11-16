import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDetails, PaymentDetailsSchema } from './schemas/payment-details';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: PaymentDetails.name, schema: PaymentDetailsSchema }])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
