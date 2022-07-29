import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ASSET_EVENT, AssetsQueuePayload, CreateAssetPayload, QUEUE_NAME } from './consumers.constants';
import { MinterAssetsService } from '../minter-service/minter-assets/minter-assets.service';

@Injectable()
@Processor(QUEUE_NAME.ASSETS)
export class AssetsConsumerService {
  private readonly logger = new Logger(AssetsConsumerService.name);

  constructor(
    @InjectQueue(QUEUE_NAME.ASSETS) private readonly assetsQueue: Queue<AssetsQueuePayload>,
    private readonly minterAssetsService: MinterAssetsService,
  ) {
    this.assetsQueue.on('error', (error: Error) => {
      this.logger.error(error.message);
    });
    this.assetsQueue.on('failed', (job: Job<CreateAssetPayload>, error: Error) => {
      this.logger.error(`${job.id} failed: ${error.message}`);
    });
    this.assetsQueue.on('completed', (job: Job<CreateAssetPayload>, result: any) => {
      this.logger.log(`${job.id} minted ${job.data.asset} for ${job.data.from}`, JSON.stringify(result));
    });
  }

  @Process(ASSET_EVENT.CREATE)
  async createAssetEvent(job: Job<CreateAssetPayload>) {
    this.logger.log(`${job.id} minting asset ${job.data.asset} for ${job.data.from}`);
    await this.minterAssetsService.mintAsset({ payerAddress: job.data.from, assetType: job.data.asset });
  }
}
