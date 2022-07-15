import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ThrottlerBehindProxyGuard } from '../throttler/throttler.guards';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @UseGuards(ThrottlerBehindProxyGuard)
  requestPaymentAddress() {
    return this.paymentService.createPaymentRequest();
  }
}
