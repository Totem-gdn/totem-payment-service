import { Observable } from 'rxjs';

export interface MintAssetRequest {
  payerAddress: string;
  assetType: string;
}

export type Empty = Record<string, never>;

export interface Assets {
  MintAsset(req: MintAssetRequest): Observable<Empty>;
}
