import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/actions/notification";
import { ORDER_STATUS_LABELS } from "@/lib/constans";

export async function PUT(request:Request) {
  try{
    const supabase = await createClient();

    const { data: {user}, error: authError } = await supabase.auth.getUser()

    if(authError || !user){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, pickup_date } = body;

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (pickup_date) {
      updateData.pickup_date = pickup_date;
    }

    if (status === 'ready_for_pickup' && !pickup_date) {
      updateData.pickup_date = new Date().toISOString();
    }

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    await createNotification({
      userId: order.user_id,
      title: 'Update Status Pesanan',
      message: `Status pesanan #${order.order_number} telah diperbarui menjadi: ${ORDER_STATUS_LABELS[status] || status}`,
      type: 'order',
      relatedId: order.order_number
    });

    return NextResponse.json({ success: true, data: order });
  }catch (error){
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}