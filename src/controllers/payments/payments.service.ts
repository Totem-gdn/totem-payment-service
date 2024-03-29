import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDetails, PaymentDetailsDocument } from './schemas/payment-details';
import { PaymentDetailsCreateDTO, PaymentDetailsDTO, PaymentDetailsFilters } from './dto/payments.dto';
import { PaymentKeyClaim, PaymentKeyClaimDocument } from './schemas/payment-key-claim';
import { PaymentKeyClaimRequestDTO } from './dto/payment-key.dto';
import { NFTProviderService } from '../../provider/nft-provider.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(PaymentDetails.name) private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(PaymentKeyClaim.name) private readonly paymentKeyClaimModel: Model<PaymentKeyClaimDocument>,
    private readonly nftProviderService: NFTProviderService,
  ) {}

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

  async claimPaymentKey(paymentKeyClaim: PaymentKeyClaimRequestDTO) {
    const txHash = await this.nftProviderService.mintAsset(paymentKeyClaim.assetType, paymentKeyClaim.player);
    await this.paymentKeyClaimModel.create({
      paymentKey: paymentKeyClaim.paymentKey,
      publisher: paymentKeyClaim.publisher,
      player: paymentKeyClaim.player,
      assetType: paymentKeyClaim.assetType,
      txHash,
    });
    return txHash;
  }
}
