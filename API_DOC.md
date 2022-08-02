### HTTP API

#### Available assets
```
# Request
GET /assets

# Response
{
    assets: ['asset1', 'asset2', 'asset3']
}
```

#### Asset payment information
```
# Request
GET /assets/{asset}/payment-info

# Response
{
    address: string;
    token: string;
    price: string;
}
```

#### Payment details list
```
# Request
GET /payments

Query params:
 - from_timestamp={timestamp_ms}
 - from_address={payer_address}

# Response. Sorted by "timestamp" field
[
    {
          transactionHash: 'tx_hash',
          from: 'payer_address',
          to: 'asset_address',
          timestamp: {timestamp_ms},
          amount: '0' // stringified ethers.BigNumber
    },
    ...
]
```
