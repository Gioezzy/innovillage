import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const metadata = data.user.user_metadata;
      const fullName = metadata.full_name || metadata.name || data.user.email?.split('@')[0];
      const avatarUrl = metadata.avatar_url || metadata.picture;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: 'customer',
        })
      } else {
        const updates: any = {};
        if (!profile.full_name && fullName) updates.full_name = fullName;
        if (!profile.avatar_url && avatarUrl) updates.avatar_url = avatarUrl;
        
        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').update(updates).eq('id', data.user.id);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
}