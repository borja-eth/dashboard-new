export type MarketType = 'SPOT' | 'INVERSE_PERPETUAL';
export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  market: MarketType;
  type: TradeType;
  entryPrice: number;
  amount: number;
  leverage: number;
  entryDate: Date;
  closePrice?: number;
  closeDate?: Date;
  status: 'OPEN' | 'CLOSED';
  pnlUSD?: number;
  pnlBTC?: number;
}

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