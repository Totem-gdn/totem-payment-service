import { Injectable } from '@nestjs/common';
import { PaymentProviderService } from '../../provider/payment-provider.service';

@Injectable()
export class AssetsService {
  constructor(private readonly providerService: PaymentProviderService) {}

  public getAssets(): string[] {
    return this.providerService.assets();
  }

  public getAssetPaymentInfo(asset: string) {
    return this.providerService.assetPaymentInfo(asset);
  }
}
