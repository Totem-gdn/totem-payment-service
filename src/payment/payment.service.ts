import { Injectable } from '@nestjs/common';
import { ProviderService } from '../provider/provider.service';

@Injectable()
export class PaymentService {
  constructor(private readonly providerService: ProviderService) {}

  public getAssets(): string[] {
    return this.providerService.assets();
  }

  public getAssetPaymentInfo(asset: string) {
    return this.providerService.assetPaymentInfo(asset);
  }
}
