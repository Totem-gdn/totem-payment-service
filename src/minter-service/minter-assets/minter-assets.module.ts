import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MinterAssetsService } from './minter-assets.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ASSET_GENERATOR_PACKAGE',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { host, port } = config.get<{ host: string; port: string }>('assetGenerator');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: `${host}:${port}`,
            package: 'assets',
            protoPath: join(__dirname, 'proto', 'assets.proto'),
          },
        });
      },
    },
    MinterAssetsService,
  ],
  exports: [MinterAssetsService],
})
export class MinterAssetsModule {}
