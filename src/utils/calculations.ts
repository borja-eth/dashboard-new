import { Trade } from '../types/types';

export const calculateTradePnL = (trade: Trade, currentPrice: number) => {
  const isOpen = trade.status === 'OPEN';
  const closePrice = isOpen ? currentPrice : trade.closePrice!;

  if (trade.market === 'SPOT') {
    if (trade.type === 'BUY') {
      // Spot BUY: Can only have USD profits
      const pnlUSD = (closePrice - trade.entryPrice) * trade.amount;
      return { pnlUSD, pnlBTC: 0 }; // No BTC profit possible on spot buys
    } else {
      // Spot SELL: Can have BTC profits
      const originalUSD = trade.entryPrice * trade.amount;
      const btcBuybackAmount = originalUSD / closePrice;
      const pnlBTC = btcBuybackAmount - trade.amount;
      const pnlUSD = pnlBTC * closePrice;
      return { pnlUSD, pnlBTC };
    }
  } else {
    // INVERSE_PERPETUAL
    if (trade.type === 'BUY') {
      // Long position with leverage
      const priceChangePercent = (closePrice - trade.entryPrice) / trade.entryPrice;
      const leveragedPnLPercent = priceChangePercent * trade.leverage;
      const pnlBTC = trade.amount * leveragedPnLPercent;
      const pnlUSD = pnlBTC * closePrice;
      return { pnlUSD, pnlBTC };
    } else {
      // Short position with leverage
      const priceChangePercent = (trade.entryPrice - closePrice) / trade.entryPrice;
      const leveragedPnLPercent = priceChangePercent * trade.leverage;
      const pnlBTC = trade.amount * leveragedPnLPercent;
      const pnlUSD = pnlBTC * closePrice;
      return { pnlUSD, pnlBTC };
    }
  }
};

export interface GlobalPnL {
  realizedPnLUSD: number;
  realizedPnLBTC: number;
  unrealizedPnLUSD: number;
  unrealizedPnLBTC: number;
  totalPnLUSD: number;
  totalPnLBTC: number;
  totalTradesCount: number;
  winningTradesCount: number;
}

export const calculateGlobalPnL = (trades: Trade[], currentPrice: number): GlobalPnL => {
  // Separate open and closed trades
  const realizedTrades = trades.filter(trade => trade.status === 'CLOSED');
  const unrealizedTrades = trades.filter(trade => trade.status === 'OPEN');

  // Calculate realized P&L from closed trades
  const realized = realizedTrades.reduce(
    (acc, trade) => {
      // For closed trades, use the actual close price stored in the trade
      const { pnlUSD, pnlBTC } = calculateTradePnL(trade, trade.closePrice!);
      return {
        usd: acc.usd + pnlUSD,
        btc: acc.btc + pnlBTC
      };
    },
    { usd: 0, btc: 0 }
  );

  // Calculate unrealized P&L from open trades
  const unrealized = unrealizedTrades.reduce(
    (acc, trade) => {
      // For open trades, use the current market price
      const { pnlUSD, pnlBTC } = calculateTradePnL(trade, currentPrice);
      return {
        usd: acc.usd + pnlUSD,
        btc: acc.btc + pnlBTC
      };
    },
    { usd: 0, btc: 0 }
  );

  // Calculate winning trades
  const winningTrades = trades.filter(trade => {
    const { pnlBTC } = calculateTradePnL(
      trade, 
      trade.status === 'CLOSED' ? trade.closePrice! : currentPrice
    );
    return pnlBTC > 0;
  });

  return {
    realizedPnLUSD: realized.usd,
    realizedPnLBTC: realized.btc,
    unrealizedPnLUSD: unrealized.usd,
    unrealizedPnLBTC: unrealized.btc,
    totalPnLUSD: realized.usd + unrealized.usd,
    totalPnLBTC: realized.btc + unrealized.btc,
    totalTradesCount: trades.length,
    winningTradesCount: winningTrades.length
  };
}; 
