import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AssetType } from '../../../utils/enum/asset-type';

@Schema({
  autoCreate: true,
  collection: 'payment_key_claim',
  id: true,
  timestamps: true,
})
export class PaymentKeyClaim {
  @Prop({ required: true, index: true, unique: true })
  paymentKey: string;

  @Prop({ required: true, index: true })
  publisher: string;

  @Prop({ required: true, index: true })
  player: string;

  @Prop({ type: SchemaTypes.String, required: true, index: true })
  assetType: AssetType;

  @Prop({ required: true, unique: true })
  txHash: string;
}

export type PaymentKeyClaimDocument = PaymentKeyClaim & Document & { createdAt: Date; updatedAt: Date };

export const PaymentKeyClaimSchema = SchemaFactory.createForClass(PaymentKeyClaim);
