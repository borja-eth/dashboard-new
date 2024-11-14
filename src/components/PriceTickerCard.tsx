'use client';

import { Box, Card, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useState, useEffect } from 'react';

interface PriceTickerCardProps {
  price: number;
}

export default function PriceTickerCard({ price }: PriceTickerCardProps) {
  const [previousPrice, setPreviousPrice] = useState(price);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (price !== previousPrice) {
      setPriceChange(price > previousPrice ? 'up' : 'down');
      setPreviousPrice(price);

      const timer = setTimeout(() => {
        setPriceChange(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [price, previousPrice]);

  return (
    <Card
      sx={{
        p: 3,
        background: 'linear-gradient(45deg, #1A1D20 30%, #2C3035 90%)',
        border: '1px solid #2B3139',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" color="text.secondary">
          BTC/USD
        </Typography>
        {priceChange && (
          {
            up: <TrendingUpIcon sx={{ color: '#0ecb81' }} />,
            down: <TrendingDownIcon sx={{ color: '#f6465d' }} />
          }[priceChange]
        )}
      </Box>
      <Typography
        variant="h3"
        sx={{
          color: priceChange
            ? priceChange === 'up'
              ? '#0ecb81'
              : '#f6465d'
            : 'text.primary',
          transition: 'color 0.3s ease',
        }}
      >
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
    </Card>
  );
} 