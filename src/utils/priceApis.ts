interface PriceAPI {
  name: string;
  url: string;
  parseResponse: (data: any) => number;
}

export const priceAPIs: PriceAPI[] = [
  {
    name: 'CoinGecko',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    parseResponse: (data) => data.bitcoin.usd,
  },
  {
    name: 'Binance',
    url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    parseResponse: (data) => parseFloat(data.price),
  },
  {
    name: 'Coinbase',
    url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
    parseResponse: (data) => parseFloat(data.data.amount),
  },
]; 