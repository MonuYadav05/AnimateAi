import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const { payment_id } = await req.json();
  if (!payment_id) {
    return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const payment = await razorpay.payments.fetch(payment_id);
    
    return NextResponse.json({
      amount: payment.amount, // in paise
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      created_at: payment.created_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch payment details' }, { status: 500 });
  }
} 