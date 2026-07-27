import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

function getRedirectUrl(base: string, path: string): string {
  return `${base}${path}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const explicitNext = searchParams.get('next');

  const supabase = await createClient();
  let user = null;

  if (token_hash && type) {
    const { error, data } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
    if (!error && data.user) {
      user = data.user;
    }
  } else if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      user = data.user;
    }
  }

  if (user) {
    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user.email?.split('@')[0];
    const avatarUrl = metadata.avatar_url || metadata.picture;

    let { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: 'customer',
        })
        .select('id, full_name, avatar_url, role')
        .maybeSingle();
      profile = newProfile;
    } else {
      const updates: Record<string, string> = {};
      if (!profile.full_name && fullName) updates.full_name = fullName;
      if (!profile.avatar_url && avatarUrl) updates.avatar_url = avatarUrl;
      
      if (Object.keys(updates).length > 0) {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      }
    }

    let redirectPath: string;
    if (explicitNext) {
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

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    const baseUrl = isLocalEnv
      ? origin
      : forwardedHost
        ? `https://${forwardedHost}`
        : origin;

    return NextResponse.redirect(getRedirectUrl(baseUrl, redirectPath));
  }

  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}