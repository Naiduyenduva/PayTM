import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prismadb';

export async function POST(req:NextRequest) {
  try {
    const body = await req.json();
    const { senderId, receiverId, transferAmount } = body;

    if (!senderId || !receiverId || !transferAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.$transaction(async (prisma) => {
      const sender = await prisma.user.findUnique({
        where: { id: senderId },
        select: { balance: true },
      });

      if (!sender) {
        throw new Error('Sender not found');
      }

      if (sender.balance < transferAmount) {
        throw new Error('Insufficient balance');
      }

      await prisma.user.update({
        where: { id: senderId },
        data: { balance: { decrement: transferAmount } },
      });

      await prisma.user.update({
        where: { id: receiverId },
        data: { balance: { increment: transferAmount } },
      });
    });

    return NextResponse.json({ message: 'Transaction successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}