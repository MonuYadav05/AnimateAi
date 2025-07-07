import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await req.json();
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Verify signature
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // Get the custom user row by auth_user_id
  const { data: userRow } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', userId) // userId here is the Supabase auth.users.id
    .single();

  if (!userRow) {
    // Optionally, create the user row here if it doesn't exist
    // Or throw an error
    return NextResponse.json({ error: 'User not found' }, { status: 500 });
  }

  const customUserId = userRow.id;

  // Update user in Supabase
  const { error: updateError } = await supabase
    .from('users')
    .update({ plan: 'pro', has_unlimited_access: true })
    .eq('id', customUserId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Store payment info
  const { error: insertError } = await supabase
    .from('payments')
    .insert({
      user_id: customUserId,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      status: 'success',
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.log(insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 