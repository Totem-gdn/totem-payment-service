import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ThrottlerBehindProxyGuard } from '../throttler/throttler.guards';
import { ResponsePaymentAddressDTO } from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('address')
  @UseGuards(ThrottlerBehindProxyGuard)
  requestPaymentAddress(): ResponsePaymentAddressDTO {
    return {
      address: this.paymentService.getPaymentAddress(),
    };
  }
}
