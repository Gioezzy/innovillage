'use server';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';
import { revalidatePath } from 'next/cache';

// --- Types ---
export interface WithdrawalRequest {
    storeId: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

export interface BankSettings {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

// --- Actions ---

export const getStoreFinanceOverview = cache(async (storeId?: string) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    let targetStoreId = storeId;

    // If no storeId provided, try to find from user profile
    if (!targetStoreId) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, store_id')
            .eq('id', user.id)
            .single();
        
        if (profile?.role === 'admin' && !profile.store_id) {
             const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
             targetStoreId = store?.id;
        } else if (profile?.store_id) {
            targetStoreId = profile.store_id;
        }
    }

    if (!targetStoreId) return null;

    // 1. Calculate Total Net Income (Completed orders only)
    const { data: orders } = await supabase
        .from('orders')
        .select('net_amount, status')
        .eq('store_id', targetStoreId)
        .eq('status', 'completed'); // Only completed orders release funds

    const totalIncome = orders?.reduce((sum, o) => sum + (o.net_amount || 0), 0) || 0;

    // 2. Calculate Total Withdrawn
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('amount, status')
        .eq('store_id', targetStoreId)
        .neq('status', 'rejected'); // Active withdrawals (pending or approved count against balance)

    const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

    // 3. Current Available Balance
    const availableBalance = totalIncome - totalWithdrawn;

    // 4. Get Bank Details
    const { data: store } = await supabase
        .from('stores')
        .select('bank_name, account_number, account_holder')
        .eq('id', targetStoreId)
        .single();

    return {
        totalIncome,
        totalWithdrawn,
        availableBalance,
        bankDetails: store,
        storeId: targetStoreId
    };
});

export async function updateBankSettings(storeId: string, settings: BankSettings) {
    const supabase = await createClient();
    
    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Update store
    const { error } = await supabase
        .from('stores')
        .update({
            bank_name: settings.bankName,
            account_number: settings.accountNumber,
            account_holder: settings.accountHolder
        })
        .eq('id', storeId);

    if (error) return { error: error.message };
    
    revalidatePath('/admin/finance');
    return { success: true };
}

export async function requestPayout(storeId: string, amount: number) {
    const supabase = await createClient();
    
    // 1. Validate Balance again
    const overview = await getStoreFinanceOverview(storeId);
    if (!overview) return { error: "Store not found" };
    
    if (amount > overview.availableBalance) {
        return { error: "Saldo tidak mencukupi." };
    }

    if (amount < 10000) {
        return { error: "Minimum penarikan Rp 10.000" };
    }

    if (!overview.bankDetails?.account_number) {
        return { error: "Mohon lengkapi data rekening bank terlebih dahulu." };
    }

    // 2. Create Withdrawal Record
    const { error } = await supabase
        .from('withdrawals')
        .insert({
            store_id: storeId,
            amount: amount,
            status: 'pending',
            bank_info: overview.bankDetails 
        });

    if (error) return { error: error.message };

    revalidatePath('/admin/finance');
    return { success: true };
}

export async function getWithdrawalHistory(storeId: string) {
    const supabase = await createClient();
    
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    return withdrawals || [];
}

// --- Super Admin Actions ---

export async function getAllWithdrawalRequests() {
    const supabase = await createClient();
    
    // Get withdrawals with store details
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*, stores(name, owner_id)')
        .order('created_at', { ascending: false });

    return withdrawals || [];
}

export async function processWithdrawal(id: string, status: 'approved' | 'rejected', proofUrl?: string, note?: string) {
    const supabase = await createClient();
    
    const updateData: any = { status, admin_note: note };
    if (proofUrl) updateData.proof_url = proofUrl;

    const { error } = await supabase
        .from('withdrawals')
        .update(updateData)
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/super-admin/payouts');
    return { success: true };
}
