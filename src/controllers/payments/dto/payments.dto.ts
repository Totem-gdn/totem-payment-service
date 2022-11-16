export interface PaymentDetailsListQueryDTO {
  from_timestamp: string;
  from_address: string;
}

export interface PaymentDetailsFilters {
  fromTimestamp: number;
  fromAddress: string;
}

export interface PaymentFaucetRequestDTO {
  address: string;
}

export interface PaymentDetailsCreateDTO {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
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
