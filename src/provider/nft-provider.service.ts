import { readFileSync } from 'fs';
import { join } from 'path';
import { webcrypto as crypto } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AssetsQueuePayload, QueueName } from '../consumers/consumers.constants';
import { BigNumber, constants, Contract, Event, providers, Wallet } from 'ethers';

type EnvAssets = Array<{
  name: string;
  contract: {
    abi: string;
    address: string;
  };
  options: {
    uriLength: number;
  };
}>;

@Injectable()
export class NFTProviderService {
  private readonly logger = new Logger(NFTProviderService.name);
  private readonly ownerWallet: Wallet;
  private readonly provider: providers.JsonRpcProvider;
  private readonly NFTContracts: Record<
    string,
    {
      contract: Contract;
      options: {
        uriLength: number;
      };
    }
  > = {};

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(QueueName.Assets) private readonly assetsQueue: Queue<AssetsQueuePayload>,
  ) {
    this.provider = new providers.JsonRpcProvider(config.get<string>('provider.rpc'));
    this.ownerWallet = new Wallet(config.get<string>('provider.privateKey'), this.provider);
    this.processAssets(config.get<EnvAssets>('assets'));
  }

  processAssets(assets: EnvAssets) {
    if (!assets.length) {
      throw new Error('no assets were provided or assets were corrupted');
    }
    for (const asset of assets) {
      const assetABI = readFileSync(join(process.cwd(), asset.contract.abi)).toString('utf8');
      const contract = new Contract(asset.contract.address, assetABI, this.ownerWallet);
      contract.on(
        contract.filters.Transfer(constants.AddressZero),
        (_from: string, to: string, tokenId: BigNumber, event: Event) => {
          this.logger.log(
            `minted asset ${asset.name} with tokenId ${tokenId} for ${to} in tx ${event.transactionHash}`,
          );
        },
      );
      this.NFTContracts[asset.name] = { contract, options: asset.options };
    }
  }

  async mintAsset(asset: string, to: string) {
    const { contract, options } = this.NFTContracts[asset];
    if (!contract) {
      throw new Error(`asset contract not found or were corrupted`);
    }
    const tokenURIBuffer = crypto.getRandomValues(new Uint8Array(options.uriLength));
    const tokenURI = `0x${Buffer.from(tokenURIBuffer).toString('hex')}`;
    const gasPrice = (await this.provider.getGasPrice()).mul(105n).div(100n); // add extra 5% to gas price
    const gasLimit = await contract.estimateGas.safeMint(to, tokenURI);
    const tx = await contract.safeMint(to, tokenURI, { gasPrice, gasLimit });
    this.logger.log(
      `minting asset: tx ${tx.hash} ` +
        `for ${to} token uri ${tokenURI} ` +
        `gas price: ${gasPrice.toString()} ` +
        `gas limit: ${gasLimit.toString()}`,
    );
  }
}
