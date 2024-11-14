'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import type { Trade, MarketType, TradeType } from '@/types/types';

interface AddTradeModalProps {
  open: boolean;
  onClose: () => void;
  onAddTrade: (trade: Trade) => void;
  currentPrice: number;
}

export default function AddTradeModal({
  open,
  onClose,
  onAddTrade,
  currentPrice,
}: AddTradeModalProps) {
  const [market, setMarket] = useState<MarketType>('SPOT');
  const [type, setType] = useState<TradeType>('BUY');
  const [amount, setAmount] = useState('');
  const [entryPrice, setEntryPrice] = useState(currentPrice.toString());
  const [leverage, setLeverage] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: Trade = {
      id: Date.now().toString(),
      market,
      type,
      amount: Number(amount),
      entryPrice: Number(entryPrice),
      leverage: Number(leverage),
      entryDate: new Date(),
      status: 'OPEN',
    };
    onAddTrade(newTrade);
    resetForm();
  };

  const resetForm = () => {
    setMarket('SPOT');
    setType('BUY');
    setAmount('');
    setEntryPrice(currentPrice.toString());
    setLeverage('1');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Trade</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Market</InputLabel>
            <Select
              value={market}
              label="Market"
              onChange={(e) => setMarket(e.target.value as MarketType)}
            >
              <MenuItem value="SPOT">Spot</MenuItem>
              <MenuItem value="INVERSE_PERPETUAL">Inverse Perpetual</MenuItem>
            </Select>
          </FormControl>
          {market === 'INVERSE_PERPETUAL' && (
            <TextField
              fullWidth
              label="Leverage"
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              inputProps={{ min: "1", step: "1" }}
              sx={{ mb: 2 }}
            />
          )}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as TradeType)}
            >
              <MenuItem value="BUY">BUY</MenuItem>
              <MenuItem value="SELL">SELL</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Amount (BTC)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ step: 'any' }}
            required
          />
          <TextField
            fullWidth
            label="Entry Price (USD)"
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            sx={{ mb: 3 }}
            inputProps={{ step: 'any' }}
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Add Trade
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                resetForm();
                onClose();
              }}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add Trade
        </Button>
      </DialogActions>
    </Dialog>
  );
}