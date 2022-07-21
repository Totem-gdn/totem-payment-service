import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, Contract, Event, providers, Wallet } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ASSETS_EVENTS, QUEUE_NAME } from '../consumers/consumers.constants';
import { AssetCreateDTO } from '../consumers/consumers.dto';

@Injectable()
export class ProviderService {
  private readonly wallet: Wallet;
  private readonly provider: providers.JsonRpcProvider;
  private readonly contract: Contract;

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(QUEUE_NAME.ASSETS) private readonly assetsQueue: Queue<AssetCreateDTO>,
  ) {
    this.wallet = new Wallet(config.get<string>('provider.privateKey'));
    this.provider = new providers.JsonRpcProvider(config.get<string>('provider.rpc'));
    this.contract = new Contract(
      config.get<string>('provider.contract.address'),
      readFileSync(join(process.cwd(), config.get<string>('provider.contract.abi'))).toString('utf8'),
    );
    this.initEventListeners();
  }

  private initEventListeners() {
    const wallet = this.wallet.connect(this.provider);
    const contract = this.contract.connect(wallet);
    // Transfers to root wallet
    contract.on(
      contract.filters.Transfer(null, wallet.address),
      (from: string, _to: string, amount: BigNumber, event: Event) => this.onTransfer(from, _to, amount, event),
    );
  }

  private async onTransfer(from: string, _to: string, amount: BigNumber, event: Event) {
    Logger.log(`[ProviderService] received payment from address ${from} with amount ${amount.toBigInt()}`);
    // TODO: add amount validation
    await this.assetsQueue.add(
      ASSETS_EVENTS.CREATE,
      { address: from, amount },
      {
        jobId: event.transactionHash, // because of jobId is unique -- it will be ignored if already exists
        attempts: 5,
        backoff: {
          type: 'exponential', // 2 ^ attempts * delay
          delay: 60 * 1000, // 1, 2, 4, 8, 16 minutes
        },
        removeOnComplete: {
          age: 24 * 60 * 60, // remove job after 24 hours to prevent duplications
        },
        removeOnFail: false,
      },
    );
  }

  public get walletAddress() {
    return this.wallet.address;
  }
}
