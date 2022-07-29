import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Assets, MintAssetRequest } from './interfaces/minter-assets.interface';

@Injectable()
export class MinterAssetsService implements OnModuleInit {
  private assetsService: Assets;

  constructor(@Inject('ASSET_GENERATOR_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.assetsService = this.client.getService<Assets>('Assets');
  }

  async mintAsset(request: MintAssetRequest): Promise<Record<string, never>> {
    return firstValueFrom<Record<string, never>>(this.assetsService.MintAsset(request));
  }
}
