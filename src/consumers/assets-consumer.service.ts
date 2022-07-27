import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ASSET_EVENT, AssetsQueuePayload, CreateAssetPayload, QUEUE_NAME } from './consumers.constants';

@Injectable()
@Processor(QUEUE_NAME.ASSETS)
export class AssetsConsumerService {
  private readonly logger = new Logger(AssetsConsumerService.name);

  constructor(@InjectQueue(QUEUE_NAME.ASSETS) private readonly assetsQueue: Queue<AssetsQueuePayload>) {
    this.assetsQueue.on('error', (error: Error) => {
      this.logger.error(error.message);
    });
  }

  @Process(ASSET_EVENT.CREATE)
  async createAssetEvent(job: Job<CreateAssetPayload>) {
    this.logger.log(`${ASSET_EVENT.CREATE}:${job.id}`);
  }
}
