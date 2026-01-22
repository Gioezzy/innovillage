import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Manajemen Pesanan - Admin',
};

interface SearchParams {
  status?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  const supabase = createAdminClient();

  let query = supabase
    .from('orders')
    .select(
      `
      *, profiles(full_name, phone),
      order_items(
        quantity,
        line_total
      )
    `
    )
    .order('created_at', { ascending: false });

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, store_id')
      .eq('id', user.id)
      .single();

    if (profile && profile.role !== 'super_admin') {
      if (profile.store_id) {
        query = query.eq('store_id', profile.store_id);
      } else {
         const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
         if (store) {
           query = query.eq('store_id', store.id);
         } else if (profile.role !== 'super_admin') {
             query = query.eq('id', '00000000-0000-0000-0000-000000000000'); 
         }
      }
    }
  } else {
     return null; 
  }

  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
  }

  const getCount = async (status: string) => {
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role, store_id').eq('id', user.id).single();
         if (profile && profile.role !== 'super_admin') {
             if (profile.store_id) {
                countQuery = countQuery.eq('store_id', profile.store_id);
             } else {
                 const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
                 if (store) {
                    countQuery = countQuery.eq('store_id', store.id);
                 }
             }
         }
      }
      const { count } = await countQuery;
      return count;
  }

  const pendingCount = await getCount('pending_payment');
  const paidCount = await getCount('paid');
  const productionCount = await getCount('in_production');
  const readyCount = await getCount('ready_for_pickup');
  const completedCount = await getCount('completed');

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Manajemen Pesanan
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola dan pantau semua transaksi pesanan.
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <FadeIn delay={0.1}>
          <div className="flex gap-3 flex-wrap mb-6">
            <Link href="/admin/orders">
              <Button
                variant={!params.status ? 'default' : 'outline'}
                className="rounded-xl"
                size="sm"
              >
                Semua
              </Button>
            </Link>
            <Link href="/admin/orders?status=pending_payment">
              <Button
                variant={
                  params.status === 'pending_payment' ? 'default' : 'outline'
                }
                className="rounded-xl gap-2"
                size="sm"
              >
                Pending
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs">
                  {pendingCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/orders?status=paid">
              <Button
                variant={params.status === 'paid' ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Dibayar
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-blue-500/10 text-blue-600 rounded-full text-xs">
                  {paidCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/orders?status=in_production">
              <Button
                variant={
                  params.status === 'in_production' ? 'default' : 'outline'
                }
                className="rounded-xl gap-2"
                size="sm"
              >
                Produksi
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-purple-500/10 text-purple-600 rounded-full text-xs">
                  {productionCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/orders?status=ready_for_pickup">
              <Button
                variant={
                  params.status === 'ready_for_pickup' ? 'default' : 'outline'
                }
                className="rounded-xl gap-2"
                size="sm"
              >
                Siap Diambil
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                  {readyCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/orders?status=completed">
              <Button
                variant={params.status === 'completed' ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Selesai
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-muted text-muted-foreground rounded-full text-xs">
                  {completedCount || 0}
                </span>
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders && orders.length > 0 ? (
                  orders?.map((order: any) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground text-sm">
                          #{order.order_number}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {order.profiles?.full_name || 'N/A'}
                          </p>
                          {order.profiles?.phone && (
                            <p className="text-xs text-muted-foreground">
                              {order.profiles.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {order.order_items?.length || 0} item(s)
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {formatRupiah(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {order.pickup_method === 'in_store'
                          ? 'Ambil di Toko'
                          : 'Delivery'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Tidak ada pesanan ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
