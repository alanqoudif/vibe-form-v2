/**
 * Netlify environment validation and checks
 */

import { isNetlify, getNetlifyContext } from './netlify';

/**
 * Validates that required environment variables are set
 * Throws an error if any are missing
 */
export function validateNetlifyEnvironment(): void {
  if (!isNetlify()) {
    return; // Not on Netlify, skip validation
  }

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables on Netlify: ${missing.join(', ')}`
    );
  }
}

/**
 * Gets environment-specific configuration
 */
export function getNetlifyConfig() {
  const context = getNetlifyContext();
  const isProduction = context === 'production';
  const isDeployPreview = context === 'deploy-preview';
  const isBranchDeploy = context === 'branch-deploy';

  return {
    isProduction,
    isDeployPreview,
    isBranchDeploy,
    context,
    // Function timeout based on tier (default to free tier)
    functionTimeout: isProduction ? 24000 : 8000, // 24s for paid, 8s for free
  };
}

