import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from './payment.constants';

@Injectable()
export class PaymentService {
  constructor(@InjectQueue(QUEUE_NAME) private readonly paymentsQueue: Queue) {
    //
  }

  createPaymentRequest() {
    Logger.log(`creating payment request`);
  }
}
