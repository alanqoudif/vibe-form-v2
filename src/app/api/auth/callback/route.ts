import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      // Create profile if it doesn't exist
      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          language: 'en',
          credits_balance: 50, // Welcome bonus
        });
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Return to home page if there's an error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}







