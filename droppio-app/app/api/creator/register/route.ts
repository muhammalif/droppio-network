import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Simulate registration success
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

    // Return a dummy success response
    return NextResponse.json({ 
      success: true, 
      message: "Creator registered successfully (dummy)"
    });
  } catch (error: any) {
    console.error("Error simulating creator registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register as creator (dummy)" },
      { status: 500 }
    );
  }
} 