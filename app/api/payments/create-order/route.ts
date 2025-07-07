import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

 const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

export async function POST(req: NextRequest) {
  const { userId, plan, amount } = await req.json();
  if (!userId || plan !== 'pro' || !amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `reciept_${Date.now()}`,
      notes: { userId, plan,amount },
    });
    return NextResponse.json({
      order_id: order.id,
      key_id: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 