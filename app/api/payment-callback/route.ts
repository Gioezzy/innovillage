import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/actions/notification";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;

    const signatureKey = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    if (signatureKey !== body.signature_key) {
      return NextResponse.json(
        { error: 'Invalid signature '},
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let orderStatus: string;
    let paymentStatus: string;

    switch (body.transaction_status) {
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
        orderStatus = 'pending_payment';
        paymentStatus = 'pending';
    }

    const { data: payment } = await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        method: body.payment_type,
        raw_response: body,
        updated_at: new Date().toISOString(),
      })
      .eq('midtrans_order_id', orderId)
      .select()
      .single();

    if (payment) {
      await supabase
        .from('orders')
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.order_id);

        if (paymentStatus === 'success') {
             const { data: order } = await supabase
                .from('orders')
                .select('user_id, order_number')
                .eq('id', payment.order_id)
                .single();
            
             if(order) {
                 await createNotification({
                    userId: order.user_id,
                    title: 'Pembayaran Berhasil',
                    message: `Pembayaran untuk pesanan #${order.order_number} telah diterima. Pesanan akan segera diproses.`,
                    type: 'payment',
                    relatedId: order.order_number
                });
             }
        }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}