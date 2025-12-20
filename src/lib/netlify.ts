/**
 * Netlify-specific utilities
 */

/**
 * Checks if the code is running on Netlify
 */
export function isNetlify(): boolean {
  return !!(
    process.env.NETLIFY ||
    process.env.NETLIFY_DEV ||
    process.env.CONTEXT
  );
}

/**
 * Gets the Netlify context (production, deploy-preview, branch-deploy, dev)
 */
export function getNetlifyContext(): string | null {
  return process.env.CONTEXT || null;
}

/**
 * Gets the Netlify site URL
 */
export function getNetlifySiteUrl(): string | null {
  return process.env.URL || process.env.DEPLOY_PRIME_URL || null;
}

/**
 * Gets the Netlify branch name
 */
export function getNetlifyBranch(): string | null {
  return process.env.BRANCH || process.env.HEAD || null;
}

/**
 * Logs Netlify-specific information for debugging
 */
export function logNetlifyInfo(): void {
  if (isNetlify()) {
    console.log('Netlify Environment:', {
      context: getNetlifyContext(),
      siteUrl: getNetlifySiteUrl(),
      branch: getNetlifyBranch(),
      isDev: !!process.env.NETLIFY_DEV,
    });
  }
}

