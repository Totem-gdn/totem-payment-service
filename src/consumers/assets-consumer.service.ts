import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { ASSETS_EVENTS, QUEUE_NAME } from './consumers.constants';
import { Job, Queue } from 'bull';
import { AssetCreateDTO } from './consumers.dto';

@Injectable()
@Processor(QUEUE_NAME.ASSETS)
export class AssetsConsumerService {
  constructor(@InjectQueue(QUEUE_NAME.ASSETS) private readonly assetsQueue: Queue<AssetCreateDTO>) {
    this.assetsQueue.on('error', (error: Error) => {
      Logger.error(`[${AssetsConsumerService.name}]: ${error.message}`);
    });
  }

  @Process(ASSETS_EVENTS.CREATE)
  async createAssetEvent(job: Job<AssetCreateDTO>) {
    Logger.log(`[${AssetsConsumerService.name}]: ${ASSETS_EVENTS.CREATE}:${job.id}`);
  }
}
