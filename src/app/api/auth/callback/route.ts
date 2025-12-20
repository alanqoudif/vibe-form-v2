import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { formatErrorResponse } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const redirect = searchParams.get('redirect') || '/';

    if (!code) {
      logger.warn('Auth callback called without code', { url: request.url });
      return NextResponse.redirect(`${origin}/login?error=missing_code`);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      logger.error('Error exchanging code for session', { error: error.message });
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    if (!data.user) {
      logger.warn('Auth callback: no user in session data');
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    // Create profile if it doesn't exist
    if (!profile && !profileError) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
        language: 'en',
        credits_balance: 50, // Welcome bonus
      });

      if (insertError) {
        logger.error('Error creating profile', { error: insertError, userId: data.user.id });
        // Continue anyway - profile can be created later
      } else {
        logger.info('Profile created for new user', { userId: data.user.id });
      }
    }

    logger.info('Auth callback successful', { userId: data.user.id });
    return NextResponse.redirect(`${origin}${redirect}`);

  } catch (error) {
    logger.error('Unexpected error in auth callback', { error });
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
















