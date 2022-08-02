import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MinterPaymentsService } from '../../minter-service/minter-payments/minter-payments.service';
import { PaymentDetailsListQueryDTO, PaymentDetailsListResponseDTO } from './payments.dto';
import { ListPaymentDetailsRequest } from '../../minter-service/minter-payments/interfaces/minter-payments.interface';

@Controller('payments')
export class PaymentsController {
  logger = new Logger(PaymentsController.name);

  constructor(private readonly minterPaymentsService: MinterPaymentsService) {}

  @Get()
  async getPaymentDetailsList(@Query() query: PaymentDetailsListQueryDTO): Promise<PaymentDetailsListResponseDTO> {
    const filters: ListPaymentDetailsRequest = {
      fromTimestamp: 0,
      fromAddress: '',
    };
    if (!!+query.from_timestamp) {
      filters.fromTimestamp = new Date(+query.from_timestamp).getTime();
    }
    if (!!query.from_address) {
      filters.fromAddress = query.from_address;
    }
    const paymentDetails = await this.minterPaymentsService.listPaymentDetails(filters);
    return { paymentDetails };
  }
}
