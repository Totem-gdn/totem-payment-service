import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDetails, PaymentDetailsDocument } from './schemas/payment-details';
import { PaymentDetailsCreateDTO, PaymentDetailsDTO, PaymentDetailsFilters } from './dto/payments.dto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(PaymentDetails.name) private readonly paymentDetailsModel: Model<PaymentDetailsDocument>) {}

  async createPaymentDetails(paymentDetails: PaymentDetailsCreateDTO) {
    await this.paymentDetailsModel.create({
      transactionHash: paymentDetails.transactionHash,
      from: paymentDetails.from,
      to: paymentDetails.to,
      amount: paymentDetails.amount,
    });
  }

  async listPaymentDetails(filters: PaymentDetailsFilters): Promise<PaymentDetailsDTO[]> {
    const paymentDetailsList: PaymentDetailsDTO[] = [];
    const query = this.paymentDetailsModel.find({}).sort({ createdAt: 'desc' }).limit(5);
    if (filters.fromTimestamp !== 0) {
      query.where('createdAt').lt(filters.fromTimestamp);
    }
    if (!!filters.fromAddress) {
      query.where('from', filters.fromAddress);
    }
    for (const paymentDetails of await query.exec()) {
      paymentDetailsList.push({
        transactionHash: paymentDetails.transactionHash,
        from: paymentDetails.from,
        to: paymentDetails.to,
        timestamp: paymentDetails.createdAt.getTime(),
        amount: paymentDetails.amount,
      });
    }
    return paymentDetailsList;
  }
}
