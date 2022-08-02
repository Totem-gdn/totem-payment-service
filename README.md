# totem-payment-service

Payment service responsible for storing assets payment information and process transaction events from ERC20 token
contract.

## Environment variables

```dotenv
# main wallet private key
PROVIDER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
# testnet or mainnet rpc endpoint
PROVIDER_RPC=https://matic-mumbai.chainstacklabs.com
# contract ABI path (can be used ERC20 common interface)
PROVIDER_ABI_FILEPATH=contract/erc20.abi.json
# USDC token address
PROVIDER_TOKEN_ADDRESS=0xB408CC68A12d7d379434E794880403393B64E44b
# Available assets
ASSETS=[{"name":"asset1","price":"5","wallet":"0x0000000000000000000000000000000000000000000000000000000000000000"},{"name":"asset2","price":"10","wallet":"0x0000000000000000000000000000000000000000000000000000000000000000"},{"name":"asset3","price":"15","wallet":"0x0000000000000000000000000000000000000000000000000000000000000000"}]
```

## Mumbai Testnet tokens

1. [MetaMask](https://metamask.io/download/) required, after installation
   - Click `Create Account` button, set account name
   - Click `Import Tokens` on `Account Assets` tab
   - Set `Token Contract Address` as `0xB408CC68A12d7d379434E794880403393B64E44b`
   - Set `Token Symbol` as `USDC`
   - Set `Token Decimal` as `0`
2. [Matic Token](https://mumbaifaucet.com/) can be requested here
3. [USDC Token](https://mumbai.polygonscan.com/address/0xb408cc68a12d7d379434e794880403393b64e44b#writeContract) can be requested with this contract:
   - Click `Connect to Web3` button
   - Select `MetaMask` in options list and click `OK`
   - Status will be changed to `Connected - Web3[0x_YOUR_WALLET_ADDRESS]`
   - Find option `6. claim` and click `Write` button
   - In MetaMask click `Confirm` button (scroll down if you don't see it)

## Payment process

1. Receive available assets list
2. Receive asset payment details
3. Call ERC20 token contract function `transfer` with web3auth provider and transfer the required number of tokens to the asset wallet address
4. totem-payment-service provider listen to ERC20 token `event Transfer` for income transfers
5. totem-payment-service provider sends `payment details` and `asset minting` events to queues
6. totem-payment-service payments consumer receives an event from queue and sends payment details to the asset-generator for storing in the persistent database
7. totem-payment-service assets consumer receives an event from queue and sends request to the asset-generator to mint asset for the payer's address
