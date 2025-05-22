import { NextResponse } from 'next/server';
import { registerAsCreator } from '@/lib/contracts';

export async function POST(req: Request) {
  try {
    const tx = await registerAsCreator();
    return NextResponse.json({ success: true, transactionHash: tx.hash });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
} 