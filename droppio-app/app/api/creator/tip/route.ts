import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { creatorId, amount, message } = await req.json();

    if (!creatorId || !amount) {
      return NextResponse.json(
        { error: 'Creator ID and amount are required' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response with dummy data
    return NextResponse.json({ 
      success: true, 
      tip: {
        id: Math.random().toString(36).substr(2, 9),
        amount: amount,
        message: message || '',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      { error: 'Failed to create tip' },
      { status: 500 }
    );
  }
} 