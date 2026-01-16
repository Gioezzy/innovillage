'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getStaffList() {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
  
  if (!store) return [];

  const { data: staff } = await supabase
      .from('profiles')
      .select('*')
      .eq('store_id', store.id)
      .eq('role', 'artisan')
      .order('created_at', { ascending: false });

  return staff || [];
}

export async function createStaffAction(formData: FormData) {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { data: requesterProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();

  if (requesterProfile?.role !== 'admin' || !store) {
      return { error: 'Unauthorized. Hanya Admin Toko yang dapat menambahkan staff.' };
  }

  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { createClient: createServiceClient } = await import ('@supabase/supabase-js');
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
  });

  if (authError) {
      console.error("Staff auth creation error", authError);
      return { error: authError.message };
  }

  if (!authData.user) {
      return { error: 'Gagal membuat user' };
  }

  const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
          id: authData.user.id,
          full_name: fullName,
          role: 'artisan',
          store_id: store.id 
      })
      .select()
      .single();

  if (profileError) {
      console.error("Staff profile creation error", profileError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { error: 'Gagal membuat profil staff.' };
  }

  revalidatePath('/admin/staff');
  return { success: true };
}

export async function deleteStaffAction(userId: string) {
  const supabase = await createClient();
  const { createClient: createServiceClient } = await import ('@supabase/supabase-js');
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  
  revalidatePath('/admin/staff');
  return { success: true };
}
