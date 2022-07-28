import { Observable } from 'rxjs';

export interface MintAssetRequest {
  payerAddress: string;
  assetType: string;
}

export interface Assets {
  MintAsset(req: MintAssetRequest): Observable<Record<string, never>>;
}
