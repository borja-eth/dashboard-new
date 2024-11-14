'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import { Trade } from '../types/types';
import { calculateTradePnL } from '../utils/calculations';

interface TradesListProps {
  trades: Trade[];
  currentPrice: number;
  onUpdateTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

export default function TradesList({
  trades,
  currentPrice,
  onUpdateTrade,
  onDeleteTrade,
}: TradesListProps) {
  const [closingTrade, setClosingTrade] = useState<Trade | null>(null);
  const [closePrice, setClosePrice] = useState<string>('');

  const handleCloseTrade = (trade: Trade) => {
    setClosingTrade(trade);
    setClosePrice(currentPrice.toString());
  };

  const handleConfirmClose = () => {
    if (closingTrade && closePrice) {
      const { pnlUSD, pnlBTC } = calculateTradePnL({
        ...closingTrade,
        closePrice: Number(closePrice),
        status: 'CLOSED'
      }, Number(closePrice));

      const updatedTrade: Trade = {
        ...closingTrade,
        closePrice: Number(closePrice),
        closeDate: new Date(),
        status: 'CLOSED',
        pnlUSD,
        pnlBTC
      };

      onUpdateTrade(updatedTrade);
      setClosingTrade(null);
      setClosePrice('');
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Market</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Entry Price</TableCell>
              <TableCell>Amount (BTC)</TableCell>
              <TableCell>Leverage</TableCell>
              <TableCell>Entry Date</TableCell>
              <TableCell>Close Price</TableCell>
              <TableCell>Unrealized P&L (USD)</TableCell>
              <TableCell>Unrealized P&L (BTC)</TableCell>
              <TableCell>Realized P&L (USD)</TableCell>
              <TableCell>Realized P&L (BTC)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => {
              const { pnlUSD, pnlBTC } = calculateTradePnL(trade, currentPrice);
              const isRealized = trade.status === 'CLOSED';

              return (
                <TableRow
                  key={trade.id}
                  sx={{
                    backgroundColor:
                      trade.status === 'OPEN'
                        ? pnlUSD >= 0
                          ? 'rgba(14, 203, 129, 0.1)'
                          : 'rgba(246, 70, 93, 0.1)'
                        : 'transparent',
                  }}
                >
                  <TableCell>{trade.market}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>${trade.entryPrice.toLocaleString()}</TableCell>
                  <TableCell>{trade.amount.toFixed(8)}</TableCell>
                  <TableCell>
                    {trade.market === 'INVERSE_PERPETUAL' ? `${trade.leverage}x` : '-'}
                  </TableCell>
                  <TableCell>{new Date(trade.entryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {trade.closePrice
                      ? `$${trade.closePrice.toLocaleString()}`
                      : `$${currentPrice.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: !isRealized && pnlUSD >= 0 ? '#0ecb81' : '#f6465d',
                    }}
                  >
                    {!isRealized && `$${pnlUSD.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: !isRealized && pnlBTC >= 0 ? '#0ecb81' : '#f6465d',
                    }}
                  >
                    {!isRealized && `₿${pnlBTC.toFixed(8)}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: isRealized && trade.pnlUSD! >= 0 ? '#0ecb81' : '#f6465d',
                    }}
                  >
                    {isRealized && `$${trade.pnlUSD!.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: isRealized && trade.pnlBTC! >= 0 ? '#0ecb81' : '#f6465d',
                    }}
                  >
                    {isRealized && `₿${trade.pnlBTC!.toFixed(8)}`}
                  </TableCell>
                  <TableCell>{trade.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleCloseTrade(trade)}
                      disabled={trade.status === 'CLOSED'}
                    >
                      <Close />
                    </IconButton>
                    <IconButton onClick={() => onDeleteTrade(trade.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(closingTrade)} onClose={() => setClosingTrade(null)}>
        <DialogTitle>Close Trade</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Close Price (USD)"
            type="number"
            fullWidth
            value={closePrice}
            onChange={(e) => setClosePrice(e.target.value)}
            inputProps={{ step: 'any' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClosingTrade(null)}>Cancel</Button>
          <Button onClick={handleConfirmClose} variant="contained" color="primary">
            Close Trade
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}