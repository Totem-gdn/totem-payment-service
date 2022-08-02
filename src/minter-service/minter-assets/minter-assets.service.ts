import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Assets, Empty, MintAssetRequest } from './interfaces/minter-assets.interface';

@Injectable()
export class MinterAssetsService implements OnModuleInit {
  private assetsService: Assets;

  constructor(@Inject('ASSETS_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.assetsService = this.client.getService<Assets>('Assets');
  }

  async mintAsset(request: MintAssetRequest): Promise<Empty> {
    return firstValueFrom<Empty>(this.assetsService.MintAsset(request));
  }
}
