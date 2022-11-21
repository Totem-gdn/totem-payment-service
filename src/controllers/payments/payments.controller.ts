import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PaymentDetailsFilters, PaymentDetailsListQueryDTO, PaymentDetailsListResponseDTO } from './dto/payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getPaymentDetailsList(@Query() query: PaymentDetailsListQueryDTO): Promise<PaymentDetailsListResponseDTO> {
    const filters: PaymentDetailsFilters = {
      fromTimestamp: 0,
      fromAddress: '',
    };
    if (!!+query.from_timestamp) {
      filters.fromTimestamp = new Date(+query.from_timestamp).getTime();
    }
    if (!!query.from_address) {
      filters.fromAddress = query.from_address;
    }
    const paymentDetails = await this.paymentsService.listPaymentDetails(filters);
    return { paymentDetails };
  }
}
