import puppeteer from 'puppeteer';
import { BadRequestException, Controller, Get, Logger, Query } from '@nestjs/common';
import { MinterPaymentsService } from '../../minter-service/minter-payments/minter-payments.service';
import { PaymentDetailsListQueryDTO, PaymentDetailsListResponseDTO, PaymentFaucetRequestDTO } from './payments.dto';
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

  @Get('faucet')
  async requestFaucet(@Query() { address }: PaymentFaucetRequestDTO): Promise<void> {
    const browser = await puppeteer.launch();
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('https://mumbaifaucet.com/');
    await page.waitForSelector('.alchemy-faucet-panel-input-text');
    await page.type('.alchemy-faucet-panel-input-text', address);
    await page.click('.alchemy-faucet-button');
    try {
      // waiting for selector that only appears in case of success (4 seconds max)
      await page.waitForSelector('.alchemy-faucet-table-data.col-md-10', { timeout: 4000 });
      const resultElement = await page.$('.alchemy-faucet-table-data.col-md-10');
      const resultText = await resultElement.getProperty('innerText');
      const result = await resultText.jsonValue();
      this.logger.log(`Successful faucet for ${address} with result: ${result}`);
    } catch (e) {
      //if success selector wasn't found we are looking for a message that says what went wrong
      await page.waitForSelector('.alert.alert-primary', { timeout: 4000 });
      const errorElement = await page.$('.alert.alert-primary');
      const errorText = await errorElement.getProperty('innerText');
      const error = await errorText.jsonValue();
      this.logger.error(`Failed to request faucet with error: ${error}`);
      throw new BadRequestException(error);
      // List of possible errors I've found so far:
      // Sorry! To be fair to all developers, we only send 0.5 Mumbai MATIC every 24 hours. Please try again after 24 hours from your original request.
      // Your request did not complete the reCAPTCHA as expected, so we could not complete your request. Please refresh the page and try again.
      // Your wallet address was missing from the request, so we didn't send you any test token. Please enter your address and request again to use the faucet.
    } finally {
      await browser.close();
    }
  }
}
