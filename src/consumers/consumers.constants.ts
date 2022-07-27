import { BigNumber } from 'ethers';

export const enum QUEUE_NAME {
  ASSETS = 'assets',
}

export const enum ASSET_EVENT {
  CREATE = 'create-asset',
}

export type AssetsQueuePayload = CreateAssetPayload;

export type CreateAssetPayload = {
  from: string;
  asset: string;
  amount: BigNumber;
};
