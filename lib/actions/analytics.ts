'use server';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getAdminAnalytics = cache(async () => {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .in('status', ['paid', 'in_production', 'ready_for_pickup', 'completed']);

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  
  const monthRevenue = revenueData
    ?.filter(order => new Date(order.created_at) >= startOfMonth)
    .reduce((sum, order) => sum + order.total_amount, 0) || 0;

  const lastMonthRevenue = revenueData
    ?.filter(order => {
      const date = new Date(order.created_at);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    })
    .reduce((sum, order) => sum + order.total_amount, 0) || 0;

  const revenueGrowth = lastMonthRevenue > 0 
    ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : 0;

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: monthOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());

  const { count: lastMonthOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString());

  const ordersGrowth = lastMonthOrders && lastMonthOrders > 0
    ? (((monthOrders || 0) - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
    : 0;

  const { count: totalCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');

  const { count: monthCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')
    .gte('created_at', startOfMonth.toISOString());

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, quantity, products(name)');

  interface ProductSales {
    [key: string]: {
      name: string;
      quantity: number;
    };
  }

  const productSales = orderItems?.reduce<ProductSales>((acc, item) => {
    if (!item.product_id) return acc;
    
    if (!acc[item.product_id]) {
      const products = item.products as unknown as { name: string } | null;
      const productsName = products?.name || 'Unknown';

      acc[item.product_id] = {
        name: productsName,
        quantity: 0,
      };
    }
    acc[item.product_id].quantity += item.quantity;
    return acc;
  }, {});

  const topProducts = Object.values(productSales || {})
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const { data: orders } = await supabase
    .from('orders')
    .select('status, marketplace_platform');

  const statusBreakdown = orders?.reduce<Record<string, number>>((acc, order) => {
    acc[order.status || 'unknown'] = (acc[order.status || 'unknown'] || 0) + 1;
    return acc;
  }, {});

  // Payment method breakdown
  const paymentMethodBreakdown = orders?.reduce<Record<string, number>>((acc, order) => {
    let paymentMethod = 'Midtrans'; // Default for orders without marketplace_platform
    
    if (order.marketplace_platform) {
      paymentMethod = order.marketplace_platform;
    }
    
    acc[paymentMethod] = (acc[paymentMethod] || 0) + 1;
    return acc;
  }, {});

  return {
    revenue: {
      total: totalRevenue,
      month: monthRevenue,
      growth: Number(revenueGrowth),
    },
    orders: {
      total: totalOrders || 0,
      month: monthOrders || 0,
      growth: Number(ordersGrowth),
    },
    customers: {
      total: totalCustomers || 0,
      month: monthCustomers || 0,
    },
    products: {
      total: totalProducts || 0,
    },
    topProducts,
    statusBreakdown,
    paymentMethodBreakdown,
  };
});

export const getSuperAdminAnalytics = cache(async () => {
    const supabase = await createClient();
  
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
  
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
  
    if (!profile || profile.role !== 'super_admin') {
      return null;
    }

    // 1. Total Revenue (All Stores)
    const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .in('status', ['paid', 'in_production', 'ready_for_pickup', 'completed']);
    
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;

    // 2. Total Users & Stores
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
    
    const { count: totalStores } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });
    
    const { count: activeStores } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

    // 3. Traffic Overview (Current Month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { count: monthTraffic } = await supabase
        .from('website_traffic')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

    return {
        totalRevenue,
        totalUsers: totalUsers || 0,
        totalStores: totalStores || 0,
        activeStores: activeStores || 0,
        monthTraffic: monthTraffic || 0,
    };
});
