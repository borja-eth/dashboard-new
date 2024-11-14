'use client';

import { Grid, Card, Typography, Box } from '@mui/material';
import { GlobalPnL } from '../types/types';

interface GlobalStatsProps {
  data: GlobalPnL;
}

export default function GlobalStats({ data }: GlobalStatsProps) {
  const formatBTC = (value: number) => {
    return value.toFixed(8);
  };

  const formatUSD = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const stats = [
    {
      label: 'Realized P&L (BTC)',
      value: `₿${formatBTC(data.realizedPnLBTC)}`,
      color: data.realizedPnLBTC >= 0 ? '#0ecb81' : '#f6465d',
    },
    {
      label: 'Unrealized P&L (BTC)',
      value: `₿${formatBTC(data.unrealizedPnLBTC)}`,
      color: data.unrealizedPnLBTC >= 0 ? '#0ecb81' : '#f6465d',
    },
    {
      label: 'Total P&L (BTC)',
      value: `₿${formatBTC(data.totalPnLBTC)}`,
      color: data.totalPnLBTC >= 0 ? '#0ecb81' : '#f6465d',
    },
    {
      label: 'Realized P&L (USD)',
      value: `$${formatUSD(data.realizedPnLUSD)}`,
      color: data.realizedPnLUSD >= 0 ? '#0ecb81' : '#f6465d',
    },
    {
      label: 'Unrealized P&L (USD)',
      value: `$${formatUSD(data.unrealizedPnLUSD)}`,
      color: data.unrealizedPnLUSD >= 0 ? '#0ecb81' : '#f6465d',
    },
    {
      label: 'Win Rate',
      value: formatPercentage(data.winningTradesCount / Math.max(data.totalTradesCount, 1)),
      color: 'text.primary',
    },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={4} key={stat.label}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(45deg, #1A1D20 30%, #2C3035 90%)',
              border: '1px solid #2B3139',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: stat.color,
                mt: 1,
              }}
            >
              {stat.value}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}