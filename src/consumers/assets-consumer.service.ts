import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { AssetEvent, AssetsQueuePayload, CreateAssetPayload, QueueName } from './consumers.constants';
import { MinterAssetsService } from '../minter-service/minter-assets/minter-assets.service';

@Injectable()
@Processor(QueueName.Assets)
export class AssetsConsumerService {
  private readonly logger = new Logger(AssetsConsumerService.name);

  constructor(
    @InjectQueue(QueueName.Assets) private readonly queue: Queue<AssetsQueuePayload>,
    private readonly minterAssetsService: MinterAssetsService,
  ) {
    this.queue.on('error', (error: Error) => {
      this.logger.error(error.message);
    });
    this.queue.on('failed', (job: Job<CreateAssetPayload>, error: Error) => {
      this.logger.error(`${job.id} failed: ${error.message}`);
    });
    this.queue.on('completed', (job: Job<CreateAssetPayload>, result: any) => {
      this.logger.log(`${job.id} minted ${job.data.asset} for ${job.data.from}`, JSON.stringify(result));
    });
  }

  @Process(AssetEvent.Create)
  async createAssetEvent(job: Job<CreateAssetPayload>) {
    this.logger.log(`${job.id} minting asset ${job.data.asset} for ${job.data.from}`);
    await this.minterAssetsService.mintAsset({ payerAddress: job.data.from, assetType: job.data.asset });
  }
}
