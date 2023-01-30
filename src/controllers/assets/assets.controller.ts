import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { NFTProviderService } from '../../provider/nft-provider.service';
import { ResponseAssetPaymentInfoDTO, ResponseAssetsDTO, ResponseGenerateDnaDTO } from './assets.dto';
import { AssetType } from '../../utils/enum/asset-type';
import { AssetTypePipe } from '../../utils/pipes/asset-type.pipe';

@Controller('assets')
export class AssetsController {
  constructor(
    private readonly paymentService: AssetsService,
    private readonly nftProviderService: NFTProviderService,
  ) {}

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

  @Get(':asset/generate-dna')
  generateAssetDNA(@Param('asset', new AssetTypePipe()) asset: AssetType): ResponseGenerateDnaDTO {
    const dna = this.nftProviderService.generateDNA(asset);
    return { dna };
  }
}
