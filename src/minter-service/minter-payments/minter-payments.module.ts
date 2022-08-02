import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MinterPaymentsService } from './minter-payments.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PAYMENTS_PACKAGE',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { host, port } = config.get<{ host: string; port: string }>('assetGenerator');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: `${host}:${port}`,
            package: 'payments',
            protoPath: join(__dirname, 'proto', 'payments.proto'),
          },
        });
      },
    },
    MinterPaymentsService,
  ],
  exports: [MinterPaymentsService],
})
export class MinterPaymentsModule {}
