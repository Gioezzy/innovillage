/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '../supabase/server';
import { checkTransactionStatus, createMidtransTransaction } from '../midtrans';
import { revalidatePath } from 'next/cache';

export async function checkPaymentStatusAction(orderId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*, payments(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (!order) {
    return { error: 'Order not found' };
  }

  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  if (!payment?.midtrans_order_id) {
    return { error: 'Payment not found' };
  }

  const result = await checkTransactionStatus(payment.midtrans_order_id);

  if (!result.success) {
    return { error: 'Failed to check payment status' };
  }

  const status = result.data;

  let orderStatus: string;
  let paymentStatus: string;

  switch (status?.transaction_status) {
    case 'capture':
    case 'settlement':
      orderStatus = 'paid';
      paymentStatus = 'success';
      break;
    case 'pending':
      orderStatus = 'pending_payment';
      paymentStatus = 'pending';
      break;
    case 'deny':
    case 'expire':
    case 'cancel':
      orderStatus = 'cancelled';
      paymentStatus = 'failed';
      break;
    default:
      orderStatus = order.status;
      paymentStatus = payment.status;
  }

  await supabase
    .from('payments')
    .update({
      status: paymentStatus,
      method: status?.payment_type,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  await supabase
    .from('orders')
    .update({
      status: orderStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);

  return {
    success: true,
    status: orderStatus,
    paymentStatus,
  };
}

export async function generatePaymentTokenAction(orderId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (orderError || !order) return { error: 'Order not found' };

  if (order.status !== 'pending_payment') {
    return { error: 'Order is not awaiting payment.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (!profile) return { error: 'Profile not found' };

  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle();

  const uniqueMidtransOrderId = `${order.order_number}-${Date.now()}`;

  const paymentResult = await createMidtransTransaction({
    orderId: uniqueMidtransOrderId,
    amount: order.total_amount,
    customerDetails: {
      firstName: profile.full_name || 'Customer',
      email: user.email!,
      phone: profile.phone || '08123456789',
    },
    itemDetails: order.order_items.map((item: any) => ({
      id: item.product_id || item.id,
      name: item.product_snapshot.name,
      price: item.unit_price,
      quantity: item.quantity,
    })),
  });

  if (!paymentResult.success || !paymentResult.token) {
    return { error: 'Failed to create Midtrans transaction' };
  }

  if (existingPayment) {
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        midtrans_order_id: uniqueMidtransOrderId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPayment.id);
    if (updateError) {
      console.error('Payment update error:', updateError);
      return { error: `Failed to update payment record: ${updateError.message}` };
    }
  } else {
    const { error: insertError } = await supabase.from('payments').insert({
      order_id: order.id,
      midtrans_order_id: uniqueMidtransOrderId,
      amount: order.total_amount,
      status: 'pending',
    });
    if (insertError) {
      console.error('Payment insert error:', insertError);
      return { error: `Failed to save new payment record: ${insertError.message}` };
    }
  }

  revalidatePath(`/orders/${orderId}`);

  return { success: true, paymentToken: paymentResult.token };
}