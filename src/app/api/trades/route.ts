import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { entryDate: 'desc' },
    });
    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const trade = await prisma.trade.create({
      data: {
        market: data.market,
        type: data.type,
        entryPrice: data.entryPrice,
        amount: data.amount,
        leverage: data.leverage,
        status: 'OPEN',
      },
    });
    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 });
  }
} 