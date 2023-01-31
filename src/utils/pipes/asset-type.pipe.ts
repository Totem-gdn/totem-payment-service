import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AssetType } from '../enum/asset-type';

@Injectable()
export class AssetTypePipe implements PipeTransform<string, AssetType> {
  transform(value: string): AssetType {
    switch (value) {
      case 'avatar':
        return AssetType.AVATAR;
      case 'item':
        return AssetType.ITEM;
      case 'gem':
        return AssetType.GEM;
      default:
        throw new BadRequestException(`invalid asset type "${value}"`);
    }
  }
}
