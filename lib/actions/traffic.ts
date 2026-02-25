'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function recordVisit(path: string) {
  const supabase = await createAdminClient();
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'unknown';
  
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
  
  const ipHash = ip !== 'unknown' ? Buffer.from(ip).toString('base64') : 'unknown';

  try {
    await supabase.from('website_traffic').insert({
        path,
        user_agent: userAgent,
        ip_hash: ipHash,
    });
  } catch (error) {
    console.error("Failed to record traffic:", error);
  }
}

export async function getTrafficStats() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'super_admin') {
        return null;
    }

    const { count: totalVisits } = await supabase
        .from('website_traffic')
        .select('id', { count: 'exact', head: true });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    
    const { count: monthVisits } = await supabase
        .from('website_traffic')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

    const { data: recentTraffic } = await supabase
        .from('website_traffic')
        .select('path, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    const { count: totalMotifScans } = await supabase
        .from('motif_images')
        .select('id', { count: 'exact', head: true });

    const { count: monthMotifScans } = await supabase
        .from('motif_images')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

    return {
        totalVisits: totalVisits || 0,
        monthVisits: monthVisits || 0,
        recentTraffic: recentTraffic || [],
        totalMotifScans: totalMotifScans || 0,
        monthMotifScans: monthMotifScans || 0,
    };
}
