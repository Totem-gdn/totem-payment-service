export interface PaymentDetailsListQueryDTO {
  from_timestamp: string;
  from_address: string;
}

export interface PaymentDetailsDTO {
  transactionHash: string;
  from: string;
  to: string;
  timestamp: number;
  amount: string;
}

export interface PaymentDetailsListResponseDTO {
  paymentDetails: PaymentDetailsDTO[];
}
