'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { StoreInsert, StoreUpdate } from '../types';

export async function createStoreAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newStore: StoreInsert = {
    name,
    slug,
    description,
    owner_id: user.id,
    is_active: true,
    is_verified: false, 
  };

  const { data, error } = await supabase.from('stores').insert(newStore).select().single();

  if (error) {
    console.error('Error creating store:', error);
    if (error.code === '23505') {
        return { error: 'Anda sudah memiliki toko atau nama toko sudah dipakai.' };
    }
    return { error: 'Gagal membuat toko.' };
  }

  await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
  
  revalidatePath('/', 'layout');

  return { success: true, storeId: data.id };
}

export async function createStoreByAdminAction(formData: FormData) {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') {
      return { error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const ownerEmail = formData.get('owner_email') as string;
  const imageFile = formData.get('image') as File;

  
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
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

  const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
  });

  if (userError || !users) {
      console.error("User list failed", userError);
      return { error: 'Gagal mengambil data user.' };
  }

  const normalizedEmail = ownerEmail.toLowerCase().trim();
  const userData = users.find(u => u.email?.toLowerCase() === normalizedEmail);

  if (!userData) {
      return { error: 'User dengan email tersebut tidak ditemukan. Pastikan user sudah terdaftar.' };
  }
  
  const ownerId = userData.id;

  const { data: ownerProfile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', ownerId)
    .single();

  if (!ownerProfile) {
      const { error: createProfileError } = await supabaseAdmin
      .from('profiles')
      .insert({
          id: ownerId,
          full_name: userData.user_metadata?.full_name || userData.user_metadata?.name || 'Store Owner',
          role: 'admin'
      });
        
    if (createProfileError) {
        console.error("Create profile error", createProfileError);
        return { error: 'Gagal membuat proifil user.' };
    }
  }

  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
      const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, imageFile, {
              cacheControl: "3600",
              upsert: false,
          });
      
      if (uploadError) {
          console.error("Upload error", uploadError);
          return { error: 'Gagal mengupload gambar.' };
      }

      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(fileName);
      imageUrl = publicUrl;
  }

  const newStore: StoreInsert = {
      name,
      slug,
      description,
      owner_id: ownerId,
      image_url: imageUrl,
      is_active: true,
      is_verified: true,
  };

  const { error: storeError } = await supabaseAdmin.from('stores').insert(newStore);

  if (storeError) {
      console.error("Create store error", storeError);
      if (storeError.code === '23505') {
        return { error: 'Slug atau Nama Toko sudah digunakan.' };
      }
      return { error: 'Gagal membuat toko.' };
  }

  await supabaseAdmin.from('profiles').update({ role: 'admin' }).eq('id', ownerId);

  revalidatePath('/super-admin/stores');
  return { success: true };
}

export async function getUserStore() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, role')
    .eq('id', user.id)
    .single();

  if (profile?.store_id) {
    const { data } = await supabase
        .from('stores')
        .select('*')
        .eq('id', profile.store_id)
        .single();
    return data;
  }

  const { data } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  return data;
}

export async function getStoreById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function getAllStores() {
    const supabase = await createClient();
    const { data } = await supabase.from('stores').select('*').eq('is_active', true);
    return data || [];
}

export async function getStoreBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

export async function updateStoreAction(storeId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { data: store } = await supabase
    .from('stores')
    .select('owner_id')
    .eq('id', storeId)
    .single();

  if (!store) return { error: 'Toko tidak ditemukan' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, store_id')
    .eq('id', user.id)
    .single();
  
  const isSuperAdmin = profile?.role === 'super_admin';
  const isOwner = store.owner_id === user.id;
  const isAdmin = profile?.role === 'admin' && profile?.store_id === storeId;
  const isStaff = profile?.role === 'artisan' && profile?.store_id === storeId;

  if (!isOwner && !isSuperAdmin && !isAdmin && !isStaff) {
    return { error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const imageUrlInput = formData.get('image_url') as string; 
  const bannerUrlInput = formData.get('banner_url') as string;

  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  let imageUrl = undefined;
  if (imageUrlInput && imageUrlInput.startsWith('http')) {
      imageUrl = imageUrlInput;
  }

  let bannerUrl = undefined;
  if (bannerUrlInput && bannerUrlInput.startsWith('http')) {
      bannerUrl = bannerUrlInput;
  }
  
  const updates: StoreUpdate = {
    name,
    slug, 
    description,
    image_url: imageUrl,
    banner_url: bannerUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from('stores')
    .update(updates)
    .eq('id', storeId);

  if (error) {
    console.error('Error updating store:', error);
    if (error.code === '23505') {
      return { error: 'Slug sudah digunakan oleh toko lain' };
    }
    return { error: 'Gagal mengupdate toko' };
  }

  revalidatePath('/stores/[slug]', 'page');
  revalidatePath('/admin/store/settings');
  
  return { success: true };
}