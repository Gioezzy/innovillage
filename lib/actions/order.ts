'use server'

import { OrderWithDetails } from '../types';
import { createClient } from "@/lib/supabase/server"
import { createMidtransTransaction } from "../midtrans"
import { generateOrderNumber } from "../utils"
import { redirect } from "next/navigation"
import { cache } from 'react'

export interface OrderItem{
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderInput {
  items: OrderItem[]
  pickupMethod: 'in_store' | 'delivery'
  note?: string
  address?: string
  phone?: string
  shippingCost?: number
}

export async function createOrderAction(input: CreateOrderInput) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized. Please login first.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profile not found' }
  }

  const productIds = input.items.map(item => item.productId)
  
  const { data: dbProducts, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, image_urls, store_id')
    .in('id', productIds)

  if (productsError || !dbProducts) {
    console.error('Error fetching products:', productsError)
    return { error: 'Failed to validate products' }
  }

  const storeIds = new Set(dbProducts.map((p: any) => p.store_id));
  if (storeIds.size > 1) {
      return { error: 'Pesanan mengandung produk dari toko yang berbeda. Mohon checkout per toko.' };
  }
  const storeId = Array.from(storeIds)[0] as string;

  const productMap = new Map(dbProducts.map(p => [p.id, p]))

  let totalAmount = 0
  const validatedItems = []

  for (const item of input.items) {
    const dbProduct = productMap.get(item.productId)
    
    if (!dbProduct) {
      return { error: `Product not found: ${item.productName}` }
    }

    const itemTotal = dbProduct.price * item.quantity
    totalAmount += itemTotal

    validatedItems.push({
      productId: dbProduct.id,
      productName: dbProduct.name,
      unitPrice: dbProduct.price, 
      quantity: item.quantity,
      lineTotal: itemTotal
    })
  }

  const shippingCost = input.shippingCost || 0
  totalAmount += shippingCost

  const orderNumber = generateOrderNumber()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      total_amount: totalAmount,
      status: 'pending_payment',
      delivery_method: input.pickupMethod,
      note: input.note,
      store_id: storeId,
      shipping_address: input.address, 
      shipping_cost: shippingCost,
      platform_fee: totalAmount * 0.01,
      net_amount: totalAmount * 0.99,
    })
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { error: 'Failed to create order' }
  }

  const orderItemsData = validatedItems.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.lineTotal,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Failed to create order items' }
  }

  const midtransItemDetails = validatedItems.map(item => ({
    id: item.productId,
    name: item.productName,
    price: item.unitPrice,
    quantity: item.quantity,
  }));

  if (shippingCost > 0) {
    midtransItemDetails.push({
      id: 'shipping-cost',
      name: 'Biaya Pengiriman',
      price: shippingCost,
      quantity: 1,
    });
  }

  const paymentResult = await createMidtransTransaction({
    orderId: orderNumber,
    amount: totalAmount,
    customerDetails: {
      firstName: profile.full_name || 'Customer',
      email: user.email!,
      phone: input.phone || profile.phone || '08123456789',
    },
    itemDetails: midtransItemDetails
  })

  if (!paymentResult.success || !paymentResult.token) {
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Failed to create payment. Please try again.' }
  }

  const { error: paymentInsertError } = await supabase.from('payments').insert({
    order_id: order.id,
    midtrans_order_id: orderNumber,
    amount: totalAmount,
    status: 'pending',
    midtrans_token: paymentResult.token,
  })

  if (paymentInsertError) {
    console.error('Payment Record Insert Error:', paymentInsertError);
    await supabase.from('orders').delete().eq('id', order.id);
    return { error: 'Gagal menyimpan data pembayaran. Mohon pastikan setup database sudah benar (RLS).' };
  }


  return {
    success: true,
    orderId: order.id,
    paymentToken: paymentResult.token,
    redirectUrl: paymentResult.redirectUrl
  }
}

export const getUserOrders = cache(async (filters?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}) => {
  const supabase = await createClient()

  const { data: { user }} = await supabase.auth.getUser()

  if(!user){
    return { orders: [], total: 0}
  }

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        products:products(*)
      ),
      payment:payments (*)
      `, {count: 'exact'})
    .eq('user_id', user.id)

  if(filters?.status) {
    query = query.eq('status', filters.status)
  }

  if(filters?.search){
    query = query.ilike('order_number', `%${filters.search}%`)
  }

  query = query.order('created_at', {ascending: false})

  if(filters?.limit){
    query = query.limit(filters.limit)
  }

  if(filters?.offset){
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1
    )
  }

  const { data, error, count } = await query

  if(error){
    console.error('Error fetching orders:', error)
    return { orders: [], total: 0}
  }

  return { orders: data as any[], total: count || 0}
})

export const getOrderById = cache(async (orderId: string): Promise<OrderWithDetails | null> => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles(full_name, phone, address),
      order_items (
        *,
        products:products(*)
      ),
      payment:payments(*)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data as unknown as OrderWithDetails
})

export const getAdminOrderById = cache(async (orderId: string): Promise<OrderWithDetails | null> => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabaseAdmin = createAdminClient();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, store_id')
    .eq('id', user.id)
    .single()

  const allowedRoles = ['admin', 'artisan', 'super_admin'];
  if (!profile || !allowedRoles.includes(profile.role || '')) {
    return null
  }

  let storeId = null;
  if (profile.role !== 'super_admin') {
      if (profile.store_id) {
        storeId = profile.store_id;
      } else {
         const { data: store } = await supabaseAdmin.from('stores').select('id').eq('owner_id', user.id).single();
         if (!store) return null;
         storeId = store.id;
      }
  }

  let query = supabaseAdmin
    .from('orders')
    .select(`
      *,
      profiles(full_name, phone, address),
      order_items (
        *,
        products:products(*)
      ),
      payment:payments(*)
    `)
    .eq('id', orderId)
  
  if (storeId) {
      query = query.eq('store_id', storeId);
  }

  const { data, error } = await query.single()

  if (error) {
    console.error('Error fetching admin order:', error)
    return null
  }

  return data as unknown as OrderWithDetails
})

export const getUserOrderStats = cache(async () => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if(!user){
    return {
      total: 0,
      pending: 0,
      inProduction: 0,
      completed: 0,
    }
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('status')
    .eq('user_id', user.id)

  if(!orders){
    return {
      total: 0,
      pending: 0,
      inProduction: 0,
      completed: 0,
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending_payment').length,
    inProduction: orders.filter(o => 
      ['paid', 'in_weaving'].includes(o.status || '')
    ).length,
    completed: orders.filter(o => o.status === 'completed').length
  }

  return stats
})



export async function getOrderIdByOrderNumber(orderNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: ownedOrder, error: ownedError } = await supabase
    .from('orders')
    .select('id')
    .eq('order_number', orderNumber)
    .eq('user_id', user.id)
    .single();

  if (ownedOrder) {
    return ownedOrder.id;
  }

  if (ownedError && ownedError.code !== 'PGRST116') { 
      console.error('Error fetching owned order ID:', ownedError);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, store_id')
    .eq('id', user.id)
    .single();

  if (profile && (profile.role === 'admin' || profile.role === 'artisan' || profile.role === 'super_admin')) {
    let query = supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber);

    if (profile.role !== 'super_admin') {
      if (profile.store_id) {
          query = query.eq('store_id', profile.store_id);
      } else {
        const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
        if (store) {
            query = query.eq('store_id', store.id);
        } else {
            return null;
        }
      }
    }

    const { data: adminOrder, error: adminError } = await query.single();

    if (adminOrder) {
      return adminOrder.id;
    }
    
    if (adminError) {
        console.error('Admin: Error fetching order ID by order number:', adminError);
    }
  }

  return null;
}



export async function cancelOrderAction(orderId: string){
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if(!user){
    return { error: 'Unauthorized' }
  }

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status, user_id')
    .eq('id', orderId)
    .single()

  if(fetchError || !order){
    return { error: 'Order not found'}
  }

  if(order.user_id !== user.id){
    return { error: 'Unauthorized'}
  }

  if(order.status !== 'pending_payment'){
    return { error: 'Hanya pesanan dengan status pending yang bisa dibatalkan'}
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({status: 'cancelled'})
    .eq('id', orderId)

  if(updateError){
    console.error('Cancel order error:', updateError)
    return { error: 'Gagal membatalkan pesanan'}
  }

  return { success: true, message: 'Pesanan berhasil dibatalkan'}
}