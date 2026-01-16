'use server'

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
          }
        },
      },
    }
  );
}

export async function removeClientSession() {
  const cookieStore = await cookies();

  try {
    const supabaseCookies = cookieStore
      .getAll()
      .filter(cookie => cookie.name.startsWith('sb-'));

    for (const cookie of supabaseCookies) {
      cookieStore.set(cookie.name, '', {
        path: '/',
        maxAge: 0,
      });
    }
  } catch (error) {
    console.log('Error removing cookies:', error);
  }
}
