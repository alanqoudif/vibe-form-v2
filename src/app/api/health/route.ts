import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { isNetlify, getNetlifyContext } from '@/lib/netlify';

/**
 * Health check endpoint
 * Used for monitoring and deployment checks
 */
export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isNetlify: isNetlify(),
        netlifyContext: getNetlifyContext(),
      },
      services: {
        supabase: {
          url: env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
          key: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
        },
        openai: {
          key: env.OPENAI_API_KEY ? 'configured' : 'missing',
        },
      },
    };

    // Check if all required services are configured
    const allConfigured =
      health.services.supabase.url === 'configured' &&
      health.services.supabase.key === 'configured' &&
      health.services.openai.key === 'configured';

    return NextResponse.json(health, {
      status: allConfigured ? 200 : 503, // Service Unavailable if not configured
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

