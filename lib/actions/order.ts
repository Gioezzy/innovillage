'use server'

import { OrderWithDetails } from '../types';
import { createClient } from "@/lib/supabase/server"
import { createMidtransTransaction } from "../midtrans"
import { generateOrderNumber } from "../utils"
import { redirect } from "next/navigation"
import { cache } from 'react'
import { getCheckoutConfig } from '../config/checkout-config'
import { checkOrderRateLimit } from '../services/rate-limiter'
import { sanitizeText, sanitizePhoneNumber, sanitizeProvince } from '../utils/sanitize'

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
  province?: string
  phone?: string
  shippingCost?: number
  checkoutMethod?: 'marketplace' | 'direct'
  marketplacePlatform?: 'shopee' | 'tokopedia'
}

export interface CreateOrderOutput {
  success?: boolean
  orderId?: string
  orderNumber?: string
  error?: string
  errorType?: 'validation' | 'database' | 'network' | 'duplicate' | 'rate_limit'
  retryable?: boolean
  
  // Rate limit specific fields
  rateLimitExceeded?: boolean
  resetAt?: string
  
  // For direct checkout
  paymentToken?: string
  redirectUrl?: string
  
  // For marketplace checkout
  checkoutMethod?: 'marketplace' | 'direct'
  marketplacePlatform?: 'shopee' | 'tokopedia'
}

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderOutput> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { 
      error: 'Unauthorized. Please login first.',
      errorType: 'validation',
      retryable: false
    }
  }

  // Check rate limit for order creation
  const rateLimitResult = checkOrderRateLimit(user.id);
  if (!rateLimitResult.allowed) {
    console.log(`[RateLimit] Order creation blocked for user ${user.id}. ${rateLimitResult.message}`);
    return { 
      error: rateLimitResult.message || 'Rate limit exceeded. Please try again later.',
      errorType: 'rate_limit',
      retryable: true,
      rateLimitExceeded: true,
      resetAt: rateLimitResult.resetAt.toISOString()
    };
  }

  // Get checkout configuration to determine enabled checkout methods
  const checkoutConfig = getCheckoutConfig()
  
  // Determine checkout method - default to marketplace if enabled, otherwise direct
  const checkoutMethod = input.checkoutMethod || 
    (checkoutConfig.marketplaceEnabled ? 'marketplace' : 'direct')
  
  // Validate checkout method is enabled
  if (checkoutMethod === 'marketplace' && !checkoutConfig.marketplaceEnabled) {
    return { 
      error: 'Marketplace checkout is not currently available',
      errorType: 'validation',
      retryable: false
    }
  }
  
  if (checkoutMethod === 'direct' && !checkoutConfig.midtransEnabled) {
    return { 
      error: 'Direct checkout is not currently available',
      errorType: 'validation',
      retryable: false
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { 
      error: 'Profile not found',
      errorType: 'validation',
      retryable: false
    }
  }

  const productIds = input.items.map(item => item.productId)
  
  const { data: dbProducts, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, image_urls, store_id')
    .in('id', productIds)

  if (productsError || !dbProducts) {
    console.error('Error fetching products:', productsError)
    return { 
      error: 'Gagal memvalidasi produk. Silakan coba lagi.',
      errorType: 'database',
      retryable: true
    }
  }

  const storeIds = new Set(dbProducts.map((p: any) => p.store_id));
  if (storeIds.size > 1) {
    return { 
      error: 'Pesanan mengandung produk dari toko yang berbeda. Mohon checkout per toko.',
      errorType: 'validation',
      retryable: false
    }
  }
  const storeId = Array.from(storeIds)[0] as string;

  const productMap = new Map(dbProducts.map(p => [p.id, p]))

  let totalAmount = 0
  const validatedItems = []

  for (const item of input.items) {
    const dbProduct = productMap.get(item.productId)
    
    if (!dbProduct) {
      return { 
        error: `Produk tidak ditemukan: ${item.productName}`,
        errorType: 'validation',
        retryable: false
      }
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

  // Sanitize user inputs to prevent XSS attacks
  const sanitizedNote = sanitizeText(input.note, 1000)
  const sanitizedAddress = sanitizeText(input.address, 500)
  const sanitizedProvince = sanitizeProvince(input.province)
  const sanitizedPhone = sanitizePhoneNumber(input.phone)

  // Validate sanitized province for delivery orders
  if (input.pickupMethod === 'delivery' && !sanitizedProvince) {
    return { 
      error: 'Provinsi tidak valid. Silakan pilih provinsi tujuan pengiriman yang valid.',
      errorType: 'validation',
      retryable: false
    }
  }

  // Validate phone number format for marketplace orders
  if (checkoutMethod === 'marketplace' && input.phone) {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const cleanPhone = sanitizedPhone?.replace(/\s/g, '') || '';
    if (!phoneRegex.test(cleanPhone)) {
      return { 
        error: 'Format nomor telepon tidak valid. Gunakan format E.164 (contoh: +628123456789).',
        errorType: 'validation',
        retryable: false
      }
    }
  }

  // Validate address length for delivery orders
  if (input.pickupMethod === 'delivery') {
    if (!sanitizedAddress || sanitizedAddress.trim() === '') {
      return { 
        error: 'Alamat pengiriman wajib diisi untuk metode pengiriman.',
        errorType: 'validation',
        retryable: false
      }
    }
    if (sanitizedAddress.length > 500) {
      return { 
        error: 'Alamat pengiriman terlalu panjang (maksimal 500 karakter).',
        errorType: 'validation',
        retryable: false
      }
    }
  }

  // Validate note length
  if (sanitizedNote && sanitizedNote.length > 1000) {
    return { 
      error: 'Catatan terlalu panjang (maksimal 1000 karakter).',
      errorType: 'validation',
      retryable: false
    }
  }

  // Set order status based on checkout method
  const orderStatus = checkoutMethod === 'marketplace' ? 'marketplace_redirect' : 'pending_payment'

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      total_amount: totalAmount,
      status: orderStatus,
      delivery_method: input.pickupMethod,
      note: sanitizedNote,
      store_id: storeId,
      shipping_address: sanitizedAddress,
      province: sanitizedProvince, // Store sanitized province
      shipping_cost: shippingCost,
      marketplace_platform: input.marketplacePlatform, // Store marketplace platform
      platform_fee: totalAmount * 0.01,
      net_amount: totalAmount * 0.99,
    })
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    // Provide specific error messages based on error type
    if (orderError.code === '23505') {
      // Unique constraint violation (duplicate order number)
      return { 
        error: 'Terjadi duplikasi nomor pesanan. Silakan coba lagi.',
        errorType: 'duplicate',
        retryable: true
      }
    } else if (orderError.code === '23503') {
      // Foreign key violation
      return { 
        error: 'Data tidak valid. Silakan refresh halaman dan coba lagi.',
        errorType: 'validation',
        retryable: true
      }
    } else if (orderError.message?.includes('timeout') || orderError.message?.includes('network')) {
      // Network or timeout errors
      return { 
        error: 'Koneksi terputus. Silakan periksa koneksi internet Anda dan coba lagi.',
        errorType: 'network',
        retryable: true
      }
    } else {
      // Generic database error
      return { 
        error: 'Gagal membuat pesanan. Silakan coba lagi dalam beberapa saat.',
        errorType: 'database',
        retryable: true
      }
    }
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
    // Rollback: delete the order that was just created
    await supabase.from('orders').delete().eq('id', order.id)
    
    // Provide specific error messages
    if (itemsError.code === '23503') {
      // Foreign key violation - product doesn't exist
      return { 
        error: 'Salah satu produk tidak ditemukan. Silakan refresh halaman dan coba lagi.',
        errorType: 'validation',
        retryable: true
      }
    } else if (itemsError.message?.includes('timeout') || itemsError.message?.includes('network')) {
      return { 
        error: 'Koneksi terputus saat menyimpan item pesanan. Silakan coba lagi.',
        errorType: 'network',
        retryable: true
      }
    } else {
      return { 
        error: 'Gagal menyimpan item pesanan. Silakan coba lagi.',
        errorType: 'database',
        retryable: true
      }
    }
  }

  // Conditionally invoke Midtrans payment processing only for direct checkout
  if (checkoutMethod === 'direct') {
    // Existing Midtrans code path - preserved
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
        phone: sanitizedPhone || profile.phone || '08123456789',
      },
      itemDetails: midtransItemDetails
    })

    if (!paymentResult.success || !paymentResult.token) {
      await supabase.from('orders').delete().eq('id', order.id)
      return { 
        error: 'Gagal membuat pembayaran. Silakan coba lagi.',
        errorType: 'database',
        retryable: true
      }
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
      return { 
        error: 'Gagal menyimpan data pembayaran. Mohon pastikan setup database sudah benar (RLS).',
        errorType: 'database',
        retryable: true
      }
    }

    // Return direct checkout response with payment token
    return {
      success: true,
      orderId: order.id,
      paymentToken: paymentResult.token,
      redirectUrl: paymentResult.redirectUrl
    }
  } else {
    // Marketplace checkout - no payment processing, return appropriate response
    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      checkoutMethod: 'marketplace' as const,
      marketplacePlatform: input.marketplacePlatform
    }
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

export interface UpdateOrderStatusInput {
  orderId: string
  newStatus: 'confirmed' | 'in_weaving' | 'quality_check' | 'ready_for_pickup' | 'completed' | 'cancelled'
  note?: string
}

export interface UpdateOrderStatusOutput {
  success: boolean
  error?: string
  notificationSent?: boolean
  notificationError?: string
}

/**
 * Update order status for marketplace orders
 * Validates status transitions and sends notifications for 'confirmed' and 'completed' statuses
 */
export async function updateOrderStatusAction(input: UpdateOrderStatusInput): Promise<UpdateOrderStatusOutput> {
  const supabase = await createClient()

  // Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please login first.' }
  }

  // Get user profile to check permissions
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, store_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  // Check if user has permission (admin, artisan, or super_admin)
  const allowedRoles = ['admin', 'artisan', 'super_admin']
  if (!allowedRoles.includes(profile.role || '')) {
    return { success: false, error: 'Unauthorized. Only store owners and admins can update order status.' }
  }

  // Fetch the order with user information
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_number, status, user_id, store_id')
    .eq('id', input.orderId)
    .single()

  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }

  // For non-super_admin users, verify they own the store
  if (profile.role !== 'super_admin') {
    let userStoreId = profile.store_id

    // If store_id not in profile, try to get it from stores table
    if (!userStoreId) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (store) {
        userStoreId = store.id
      }
    }

    // Verify order belongs to user's store
    if (!userStoreId || order.store_id !== userStoreId) {
      return { success: false, error: 'Unauthorized. You can only update orders from your own store.' }
    }
  }

  // Validate status transitions for marketplace orders
  const validStatuses = ['confirmed', 'in_weaving', 'quality_check', 'ready_for_pickup', 'completed', 'cancelled']
  if (!validStatuses.includes(input.newStatus)) {
    return { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }
  }

  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: input.newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', input.orderId)

  if (updateError) {
    console.error('Order status update error:', updateError)
    return { success: false, error: 'Failed to update order status. Please try again.' }
  }

  // Send notifications for 'confirmed' and 'completed' statuses
  let notificationSent = false
  let notificationError: string | undefined

  if (input.newStatus === 'confirmed' || input.newStatus === 'completed') {
    // Use the notification service to send order status notifications
    const { createOrderStatusNotification } = await import('../services/notification')

    const notificationResult = await createOrderStatusNotification(
      order.user_id,
      order.order_number,
      order.id,
      input.newStatus
    )

    if (notificationResult.success) {
      notificationSent = true
    } else {
      notificationError = notificationResult.error || 'Failed to send notification'
      console.error('[OrderAction] Notification error:', notificationError)
    }
  }

  return {
    success: true,
    notificationSent,
    notificationError
  }
}

export interface ExportOrdersOutput {
  success: boolean
  csv?: string
  error?: string
}

/**
 * Export all orders to CSV format
 * Generates CSV with order_id, order_date, customer_name, total_amount, status, payment_method
 * Payment method is labeled as "Midtrans", "Shopee", or "Tokopedia"
 */
export async function exportOrdersAction(): Promise<ExportOrdersOutput> {
  const supabase = await createClient()

  // Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please login first.' }
  }

  // Get user profile to check permissions
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, store_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  // Check if user has permission (admin, artisan, or super_admin)
  const allowedRoles = ['admin', 'artisan', 'super_admin']
  if (!allowedRoles.includes(profile.role || '')) {
    return { success: false, error: 'Unauthorized. Only administrators can export orders.' }
  }

  // Fetch all orders with customer information
  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      created_at,
      total_amount,
      status,
      marketplace_platform,
      store_id,
      user_id,
      profiles!orders_user_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })

  // For non-super_admin users, filter by their store
  if (profile.role !== 'super_admin') {
    let userStoreId = profile.store_id

    // If store_id not in profile, try to get it from stores table
    if (!userStoreId) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (store) {
        userStoreId = store.id
      }
    }

    if (!userStoreId) {
      return { success: false, error: 'Store not found for user' }
    }

    query = query.eq('store_id', userStoreId)
  }

  const { data: orders, error: ordersError } = await query

  if (ordersError) {
    console.error('Error fetching orders for export:', ordersError)
    return { success: false, error: 'Failed to fetch orders. Please try again.' }
  }

  if (!orders || orders.length === 0) {
    return { success: false, error: 'No orders found to export' }
  }

  // Generate CSV content
  const csvHeaders = ['order_id', 'order_date', 'customer_name', 'total_amount', 'status', 'payment_method']
  const csvRows: string[] = [csvHeaders.join(',')]

  for (const order of orders) {
    // Determine payment method based on marketplace_platform
    let paymentMethod = 'Midtrans' // Default for orders without marketplace_platform
    
    if (order.marketplace_platform) {
      // Capitalize first letter to match "Shopee" or "Tokopedia" format
      const platform = order.marketplace_platform.toLowerCase()
      if (platform === 'shopee') {
        paymentMethod = 'Shopee'
      } else if (platform === 'tokopedia') {
        paymentMethod = 'Tokopedia'
      } else {
        // Handle any other marketplace platforms
        paymentMethod = order.marketplace_platform.charAt(0).toUpperCase() + 
                       order.marketplace_platform.slice(1).toLowerCase()
      }
    }

    // Format order date (YYYY-MM-DD)
    const orderDate = order.created_at 
      ? new Date(order.created_at).toISOString().split('T')[0]
      : ''

    // Get customer name from profiles relation
    const customerName = (order.profiles as any)?.full_name || 'Unknown'

    // Escape CSV values (handle commas and quotes)
    const escapeCsvValue = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) {
        return ''
      }
      const stringValue = String(value)
      // If value contains comma, quote, or newline, wrap in quotes and escape quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    const row = [
      escapeCsvValue(order.order_number),
      escapeCsvValue(orderDate),
      escapeCsvValue(customerName),
      escapeCsvValue(order.total_amount),
      escapeCsvValue(order.status),
      escapeCsvValue(paymentMethod)
    ]

    csvRows.push(row.join(','))
  }

  const csv = csvRows.join('\n')

  return {
    success: true,
    csv
  }
}