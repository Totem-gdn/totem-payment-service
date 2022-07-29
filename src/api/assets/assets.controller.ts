import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ResponseAssetPaymentInfoDTO, ResponseAssetsDTO } from './assets.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly paymentService: AssetsService) {}

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
