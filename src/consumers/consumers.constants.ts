import { BigNumber } from 'ethers';

export const enum QueueName {
  Assets = 'assets',
  Payments = 'payments',
}

export const DefaultJobOptions = {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 5 * 60 * 1000,
  },
  removeOnComplete: {
    age: 24 * 60 * 60, // remove job after 24 hours to prevent duplications
  },
  removeOnFail: {
    age: 30 * 24 * 60 * 60, // remove job after 30 days
  },
};

export const enum AssetEvent {
  Create = 'create-asset',
}

export type AssetsQueuePayload = CreateAssetPayload;

export type CreateAssetPayload = {
  from: string;
  asset: string;
  amount: BigNumber;
};

export const enum PaymentEvent {
  Create = 'create-payment',
}

export type PaymentsQueuePayload = CreatePaymentPayload;

export type CreatePaymentPayload = {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
};
