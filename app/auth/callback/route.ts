import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getRedirectUrl(base: string, path: string): string {
  return `${base}${path}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Hanya pakai 'next' param jika eksplisit (mis. dari reset-password flow)
  const explicitNext = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const metadata = data.user.user_metadata;
      const fullName = metadata.full_name || metadata.name || data.user.email?.split('@')[0];
      const avatarUrl = metadata.avatar_url || metadata.picture;

      // Ambil atau buat profile, sekaligus baca role untuk redirect
      let { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: 'customer',
          })
          .select('id, full_name, avatar_url, role')
          .single()
        profile = newProfile;
      } else {
        const updates: Record<string, string> = {};
        if (!profile.full_name && fullName) updates.full_name = fullName;
        if (!profile.avatar_url && avatarUrl) updates.avatar_url = avatarUrl;
        
        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').update(updates).eq('id', data.user.id);
        }
      }

      // Tentukan redirect berdasarkan role
      let redirectPath: string;
      if (explicitNext) {
        // Jika ada next param eksplisit (misal /reset-password), tetap pakai itu
        redirectPath = explicitNext;
      } else {
        switch (profile?.role) {
          case 'super_admin':
            redirectPath = '/super-admin';
            break;
          case 'admin':
          case 'artisan':
            redirectPath = '/admin';
            break;
          case 'customer':
          default:
            redirectPath = '/dashboard';
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const baseUrl = isLocalEnv
        ? origin
        : forwardedHost
          ? `https://${forwardedHost}`
          : origin;

      return NextResponse.redirect(getRedirectUrl(baseUrl, redirectPath));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
}