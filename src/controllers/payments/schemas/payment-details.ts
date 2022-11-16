import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDetailsDocument = PaymentDetails & Document & { createdAt: Date; updatedAt: Date };

@Schema({
  autoCreate: true,
  collection: 'payment_details',
  id: true,
  timestamps: true,
})
export class PaymentDetails {
  @Prop({ required: true, index: true, unique: true })
  transactionHash: string;

  @Prop({ required: true, index: true })
  from: string;

  @Prop({ required: true, index: true })
  to: string;

  @Prop({ required: true })
  amount: string;
}

export const PaymentDetailsSchema = SchemaFactory.createForClass(PaymentDetails);
