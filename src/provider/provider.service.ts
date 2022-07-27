import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, Contract, Event, providers, Wallet } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ASSET_EVENT, AssetsQueuePayload, QUEUE_NAME } from '../consumers/consumers.constants';

type EnvAssets = Array<{
  name: string;
  price: string;
  wallet: string;
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
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);
  private readonly rootWallet: Wallet;
  private readonly baseProvider: providers.JsonRpcProvider;
  private readonly baseContract: Contract;
  private readonly token: {
    address: string;
    abi: string;
  };
  private readonly assetsPaymentInfo: AssetsPaymentInfo = {};

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(QUEUE_NAME.ASSETS) private readonly assetsQueue: Queue<AssetsQueuePayload>,
  ) {
    this.token = {
      address: config.get<string>('provider.contract.address'),
      abi: readFileSync(join(process.cwd(), config.get<string>('provider.contract.abi'))).toString('utf8'),
    };
    this.rootWallet = new Wallet(config.get<string>('provider.privateKey'));
    this.baseProvider = new providers.JsonRpcProvider(config.get<string>('provider.rpc'));
    this.baseContract = new Contract(this.token.address, this.token.abi);
    this.processAssets(config.get<EnvAssets>('assets'));
  }

  private processAssets(assets: EnvAssets) {
    if (!assets.length) {
      throw new Error(`no assets were provided or assets were corrupted`);
    }
    for (const asset of assets) {
      const paymentInfo: AssetPaymentInfo = {
        price: BigInt(asset.price),
        wallet: new Wallet(asset.wallet, this.baseProvider),
      };
      if (paymentInfo.price === 0n) {
        this.logger.warn(`asset ${asset.name} initialized with price ${paymentInfo.price}`);
      }
      if (paymentInfo.price < 0n) {
        throw new Error(`asset ${asset.name} price can't be less then 0, received price ${paymentInfo.price}`);
      }
      // initialize contract event listeners for asset wallet
      const contract = this.baseContract.connect(paymentInfo.wallet);
      contract.on(
        contract.filters.Transfer(null, paymentInfo.wallet.address),
        (from: string, _to: string, amount: BigNumber, event: Event) =>
          this.onAssetTransfer(asset.name, from, amount, event),
      );
      this.assetsPaymentInfo[asset.name] = paymentInfo;
    }
  }

  private async onAssetTransfer(asset: string, from: string, amount: BigNumber, event: Event) {
    this.logger.log(`payment for ${asset}, from ${from}, with amount ${amount.toString()}`, {
      transactionHash: event.transactionHash,
    });
    if (amount.toBigInt() < this.assetsPaymentInfo[asset].price) {
      this.logger.warn(`received payment is less then expected`, { transactionHash: event.transactionHash });
      return;
    }
    await this.assetsQueue.add(
      ASSET_EVENT.CREATE,
      { from, asset, amount },
      {
        jobId: event.transactionHash, // because of jobId is unique -- it will be ignored if already exists
        attempts: 5,
        backoff: {
          type: 'exponential', // 2 ^ attempts * delay
          delay: 5 * 60 * 1000,
        },
        removeOnComplete: {
          age: 24 * 60 * 60, // remove job after 24 hours to prevent duplications
        },
        removeOnFail: {
          age: 30 * 24 * 60 * 60, // remove job after 30 days
        },
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
