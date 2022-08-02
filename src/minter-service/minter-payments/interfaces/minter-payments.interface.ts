import { Observable } from 'rxjs';
import { Long } from '@grpc/proto-loader';

export interface CreatePaymentDetailsRequest {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
}

export type Empty = Record<string, never>;

export interface ListPaymentDetailsRequest {
  fromTimestamp: number;
  fromAddress: string;
}

export interface PaymentDetails {
  transactionHash: string;
  from: string;
  to: string;
  timestamp: Long;
  amount: string;
}

export interface ListPaymentDetailsResponse {
  paymentDetails: PaymentDetails[];
}

export interface Payments {
  CreatePaymentDetails(req: CreatePaymentDetailsRequest): Observable<Empty>;
  ListPaymentDetails(req: ListPaymentDetailsRequest): Observable<ListPaymentDetailsResponse>;
}
