import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, Contract, Event, providers, Wallet } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  AssetEvent,
  AssetsQueuePayload,
  DefaultJobOptions,
  PaymentEvent,
  PaymentsQueuePayload,
  QueueName,
} from '../consumers/consumers.constants';
import { AssetType } from '../utils/enum/asset-type';

type EnvAssets = Array<{
  name: AssetType;
  price: string;
  wallet: string;
  contract: {
    abi: string;
    address: string;
  };
}>;

type Asset = {
  name: string;
  price: bigint;
  wallet: Wallet;
};

type AssetPaymentInfo = Omit<Asset, 'name'>;

interface AssetsPaymentInfo {
  [name: string]: AssetPaymentInfo | undefined;
}

@Injectable()
export class PaymentProviderService {
  private readonly logger = new Logger(PaymentProviderService.name);
  private readonly wallet: Wallet;
  private readonly rpcProvider: providers.JsonRpcProvider;
  private readonly contract: Contract;
  private readonly token: {
    address: string;
    abi: string;
  };
  private readonly assetsPaymentInfo: AssetsPaymentInfo = {};

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(QueueName.Assets) private readonly assetsQueue: Queue<AssetsQueuePayload>,
    @InjectQueue(QueueName.Payments) private readonly paymentsQueue: Queue<PaymentsQueuePayload>,
  ) {
    this.token = {
      address: config.get<string>('provider.contract.address'),
      abi: readFileSync(join(process.cwd(), config.get<string>('provider.contract.abi'))).toString('utf8'),
    };
    this.wallet = new Wallet(config.get<string>('provider.privateKey'));
    this.rpcProvider = new providers.JsonRpcProvider(config.get<string>('provider.rpc'));
    this.contract = new Contract(this.token.address, this.token.abi);
    this.processAssets(config.get<EnvAssets>('assets'));
  }

  private processAssets(assets: EnvAssets) {
    if (!assets.length) {
      throw new Error(`no assets were provided or assets were corrupted`);
    }
    for (const asset of assets) {
      const paymentInfo: AssetPaymentInfo = {
        price: BigInt(asset.price),
        wallet: new Wallet(asset.wallet, this.rpcProvider),
      };
      if (paymentInfo.price === 0n) {
        this.logger.warn(`asset ${asset.name} initialized with price ${paymentInfo.price}`);
      }
      if (paymentInfo.price < 0n) {
        throw new Error(`asset ${asset.name} price can't be less then 0, received price ${paymentInfo.price}`);
      }
      // initialize contract event listeners for asset wallet
      const contract = this.contract.connect(paymentInfo.wallet);
      contract.on(
        contract.filters.Transfer(null, paymentInfo.wallet.address),
        (from: string, to: string, amount: BigNumber, event: Event) =>
          this.onAssetTransfer(asset.name, from, to, amount, event),
      );
      this.assetsPaymentInfo[asset.name] = paymentInfo;
    }
  }

  private async onAssetTransfer(asset: AssetType, from: string, to: string, amount: BigNumber, event: Event) {
    this.logger.log(
      `payment for ${asset}, from ${from}, with amount ${amount.toString()} in transaction ${event.transactionHash}`,
    );
    // register every payment
    await this.paymentsQueue.add(
      PaymentEvent.Create,
      {
        transactionHash: event.transactionHash,
        from: from,
        to: to,
        amount: amount.toString(),
      },
      {
        jobId: event.transactionHash,
        ...DefaultJobOptions,
      },
    );
    if (amount.toBigInt() < this.assetsPaymentInfo[asset].price) {
      this.logger.warn(`received payment is less then expected in transaction ${event.transactionHash}`);
      return;
    }
    await this.assetsQueue.add(
      AssetEvent.Create,
      { from, asset, amount },
      {
        jobId: event.transactionHash,
        ...DefaultJobOptions,
      },
    );
  }

  public assets(): string[] {
    return Object.keys(this.assetsPaymentInfo);
  }

  public assetPaymentInfo(asset: string) {
    const assetInfo: AssetPaymentInfo | undefined = this.assetsPaymentInfo[asset];
    if (!assetInfo) {
      return undefined;
    }
    return {
      address: assetInfo.wallet.address,
      token: this.token.address,
      price: assetInfo.price.toString(10),
    };
  }
}
