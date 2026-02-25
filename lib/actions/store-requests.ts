'use server';

import { createClient, createAdminClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitStoreRequestAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized. Silakan login terlebih dahulu.' };

    const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single();

    if (existingStore) {
        return { error: 'Anda sudah memiliki toko aktif.' };
    }

    const { data: existingRequest } = await supabase
        .from('store_requests')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

    if (existingRequest) {
        return { error: 'Anda sudah memiliki pengajuan yang sedang menunggu review.' };
    }

    const store_name = formData.get('store_name') as string;
    const store_description = formData.get('store_description') as string;

    if (!store_name?.trim()) {
        return { error: 'Nama toko tidak boleh kosong.' };
    }

    const { error } = await supabase.from('store_requests').insert({
        user_id: user.id,
        store_name: store_name.trim(),
        store_description: store_description?.trim() || null,
        status: 'pending',
    });

    if (error) {
        console.error('Error submitting store request:', error);
        return { error: 'Gagal mengirimkan pengajuan.' };
    }

    revalidatePath('/open-shop');
    return { success: true };
}

export async function getUserStoreRequest() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from('store_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    return data;
}

export async function getStoreRequestsForAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') return null;

    const { data } = await supabase
        .from('store_requests')
        .select(`
            *,
            profiles:user_id (
                id,
                full_name
            )
        `)
        .order('created_at', { ascending: false });

    return data || [];
}

export async function getPendingRequestCount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') return 0;

    const { count } = await supabase
        .from('store_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

    return count || 0;
}

export async function approveStoreRequestAction(requestId: string) {
    const supabase = await createClient();
    const supabaseAdmin = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') return { error: 'Unauthorized' };

    const { data: request, error: fetchError } = await supabase
        .from('store_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (fetchError || !request) return { error: 'Request tidak ditemukan.' };
    if (request.status !== 'pending') return { error: 'Request ini sudah diproses.' };

    const slug = request.store_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const { error: storeError } = await supabaseAdmin.from('stores').insert({
        name: request.store_name,
        slug,
        description: request.store_description,
        owner_id: request.user_id,
        is_active: true,
        is_verified: true,
    });

    if (storeError) {
        console.error('Error creating store on approve:', storeError);
        if (storeError.code === '23505') {
            return { error: 'Nama atau slug toko sudah digunakan. Minta user untuk mengubah nama toko.' };
        }
        return { error: 'Gagal membuat toko untuk user ini.' };
    }

    await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', request.user_id);

    await supabaseAdmin.from('store_requests').update({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
    }).eq('id', requestId);

    revalidatePath('/super-admin/store-requests');
    return { success: true };
}

export async function rejectStoreRequestAction(requestId: string, reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') return { error: 'Unauthorized' };

    const { error } = await supabase.from('store_requests').update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
    }).eq('id', requestId);

    if (error) {
        console.error('Error rejecting store request:', error);
        return { error: 'Gagal menolak pengajuan.' };
    }

    revalidatePath('/super-admin/store-requests');
    return { success: true };
}
