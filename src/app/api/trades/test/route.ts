import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET() {
  try {
    // Create a test trade
    const testTrade = await prisma.trade.create({
      data: {
        market: 'SPOT',
        type: 'BUY',
        entryPrice: 65000,
        amount: 0.1,
        leverage: 1,
        status: 'OPEN',
      }
    });

    // Fetch all trades to verify
    const allTrades = await prisma.trade.findMany();

    return NextResponse.json({
      message: 'Test successful',
      createdTrade: testTrade,
      allTrades: allTrades
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
} 