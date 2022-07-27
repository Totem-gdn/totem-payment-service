import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ResponseAssetPaymentInfoDTO, ResponseAssetsDTO } from './payment.dto';

@Controller('assets')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getAssets(): ResponseAssetsDTO {
    const assets = this.paymentService.getAssets();
    return { assets };
  }

  @Get(':asset/payment-info')
  getAssetPaymentInfo(@Param('asset') asset: string): ResponseAssetPaymentInfoDTO {
    if (!asset) {
      throw new HttpException(`invalid asset`, HttpStatus.BAD_REQUEST);
    }
    const assetInfo = this.paymentService.getAssetPaymentInfo(asset);
    if (!assetInfo) {
      throw new HttpException(`asset ${asset} not found`, HttpStatus.NOT_FOUND);
    }
    return {
      address: assetInfo.address,
      token: assetInfo.token,
      price: assetInfo.price,
    };
  }
}
