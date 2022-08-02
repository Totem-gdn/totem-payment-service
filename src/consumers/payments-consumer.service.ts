import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { CreatePaymentPayload, PaymentEvent, PaymentsQueuePayload, QueueName } from './consumers.constants';
import { MinterPaymentsService } from '../minter-service/minter-payments/minter-payments.service';

@Injectable()
@Processor(QueueName.Payments)
export class PaymentsConsumerService {
  private readonly logger = new Logger(PaymentsConsumerService.name);

  constructor(
    @InjectQueue(QueueName.Payments) private readonly queue: Queue<PaymentsQueuePayload>,
    private readonly minterPaymentsService: MinterPaymentsService,
  ) {
    this.queue.on('error', (error: Error) => {
      this.logger.error(error.message);
    });
    this.queue.on('failed', (job: Job<CreatePaymentPayload>, error: Error) => {
      this.logger.error(`${job.id} failed: ${error.message}`);
    });
    this.queue.on('completed', (job: Job<CreatePaymentPayload>, result: any) => {
      this.logger.log(`${job.id} saved ${job.data.from} for ${job.data.to}`, JSON.stringify(result));
    });
  }

  @Process(PaymentEvent.Create)
  async createPaymentDetails(job: Job<CreatePaymentPayload>) {
    this.logger.log(`${job.id} saving payment details from ${job.data.from}`);
    await this.minterPaymentsService.createPaymentDetails(job.data);
  }
}
