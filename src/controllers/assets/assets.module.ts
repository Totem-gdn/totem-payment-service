import { Module } from '@nestjs/common';
import { ProviderModule } from '../../provider/provider.module';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [ProviderModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
