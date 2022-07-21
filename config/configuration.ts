export default () => ({
  port: parseInt(process.env.PORT, 10),
  redis: {
    uri: process.env.REDIS_STORAGE_URI,
  },
  provider: {
    privateKey: process.env.PROVIDER_PRIVATE_KEY,
    rpc: process.env.PROVIDER_RPC,
    contract: {
      abi: process.env.PROVIDER_ABI_FILEPATH,
      address: process.env.PROVIDER_TOKEN_ADDRESS,
    },
  },
});
