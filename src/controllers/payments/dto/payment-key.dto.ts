import { IsEnum, IsNotEmpty } from 'class-validator';
import { IsValidAddress } from '../../../utils/validations/IsValidAddress';
import { AssetType } from '../../../utils/enum/asset-type';

export class PaymentKeyClaimRequestDTO {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  publisher: string;

  @IsValidAddress()
  @IsNotEmpty()
  player: string;

  @IsEnum(AssetType)
  @IsNotEmpty()
  assetType: AssetType;
}

export class PaymentKeyClaimResponseDTO {
  txHash: string;
}
