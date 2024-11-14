'use client';

import { useState, useEffect } from 'react';
import { Trade, GlobalPnL } from '../types/types';
import { 
  Box, 
  Grid, 
  Button, 
  Container,
} from '@mui/material';
import PriceTickerCard from './PriceTickerCard';
import TradesList from './TradesList';
import GlobalStats from './GlobalStats';
import AddTradeModal from './AddTradeModal';
import { calculateGlobalPnL } from '../utils/calculations';


export default function Dashboard() {
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);
  const [globalPnL, setGlobalPnL] = useState<GlobalPnL>({
    realizedPnLUSD: 0,
    realizedPnLBTC: 0,
    unrealizedPnLUSD: 0,
    unrealizedPnLBTC: 0,
    totalPnLUSD: 0,
    totalPnLBTC: 0,
    totalTradesCount: 0,
    winningTradesCount: 0,
  });

  // Fetch trades from database
  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades');
      if (!response.ok) throw new Error('Failed to fetch trades');
      const data = await response.json();
      setTrades(data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchBTCPrice = async () => {
    const apis = [
      {
        fetch: async () => {
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
          const data = await res.json();
          return data.bitcoin.usd;
        }
      },
      {
        fetch: async () => {
          const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
          const data = await res.json();
          return parseFloat(data.price);
        }
      },
      {
        fetch: async () => {
          const res = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
          const data = await res.json();
          return parseFloat(data.data.amount);
        }
      }
    ];

    for (const api of apis) {
      try {
        const price = await api.fetch();
        if (price && !isNaN(price)) {
          setBtcPrice(price);
          return;
        }
      } catch (err) {
        console.error('API fetch error:', err);
        continue;
      }
    }

    console.error('Could not fetch Bitcoin price');
  };

  useEffect(() => {
    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update global P&L whenever trades or BTC price changes
    const updatedGlobalPnL = calculateGlobalPnL(trades, btcPrice);
    setGlobalPnL(updatedGlobalPnL);
    
    // Save trades to localStorage
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades, btcPrice]);

  // Add new trade
  const handleAddTrade = async (newTrade: Trade) => {
    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrade),
      });
      if (!response.ok) throw new Error('Failed to create trade');
      await fetchTrades(); // Refresh trades list
      setIsAddTradeModalOpen(false);
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };

  // Update trade
  const handleUpdateTrade = async (updatedTrade: Trade) => {
    try {
      const response = await fetch(`/api/trades/${updatedTrade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrade),
      });
      if (!response.ok) throw new Error('Failed to update trade');
      await fetchTrades(); // Refresh trades list
    } catch (error) {
      console.error('Error updating trade:', error);
    }
  };

  // Delete trade
  const handleDeleteTrade = async (tradeId: string) => {
    try {
      const response = await fetch(`/api/trades/${tradeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete trade');
      await fetchTrades(); // Refresh trades list
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <PriceTickerCard price={btcPrice} />
        </Grid>
        <Grid item xs={12} md={8}>
          <GlobalStats data={globalPnL || {
            realizedPnLUSD: 0,
            realizedPnLBTC: 0,
            unrealizedPnLUSD: 0,
            unrealizedPnLBTC: 0,
            totalPnLUSD: 0,
            totalPnLBTC: 0,
            totalTradesCount: 0,
            winningTradesCount: 0,
          }} />
        </Grid>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddTradeModalOpen(true)}
          >
            Add New Trade
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TradesList
            trades={trades}
            currentPrice={btcPrice}
            onUpdateTrade={handleUpdateTrade}
            onDeleteTrade={handleDeleteTrade}
          />
        </Grid>
      </Grid>
      <AddTradeModal
        open={isAddTradeModalOpen}
        onClose={() => setIsAddTradeModalOpen(false)}
        onAddTrade={handleAddTrade}
        currentPrice={btcPrice}
      />
    </Box>
  );
} 