import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreatePaymentDetailsRequest,
  Empty,
  ListPaymentDetailsRequest,
  ListPaymentDetailsResponse,
  Payments,
} from './interfaces/minter-payments.interface';
import { PaymentDetailsDTO } from '../../controllers/payments/payments.dto';

@Injectable()
export class MinterPaymentsService implements OnModuleInit {
  private paymentsService: Payments;

  constructor(@Inject('PAYMENTS_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.paymentsService = this.client.getService<Payments>('Payments');
  }

  async createPaymentDetails(request: CreatePaymentDetailsRequest): Promise<Empty> {
    return firstValueFrom<Empty>(this.paymentsService.CreatePaymentDetails(request));
  }

  async listPaymentDetails(request: ListPaymentDetailsRequest): Promise<PaymentDetailsDTO[]> {
    const detailsResponse = await firstValueFrom<ListPaymentDetailsResponse>(
      this.paymentsService.ListPaymentDetails(request),
    );
    return (
      detailsResponse?.paymentDetails?.map(({ transactionHash, from, to, timestamp, amount }) => ({
        transactionHash,
        from,
        to,
        timestamp: timestamp.toNumber(),
        amount,
      })) || []
    );
  }
}
