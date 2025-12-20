/**
 * Pre-build environment variables validation script
 * This ensures all required environment variables are set before building
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
];

const missing = [];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('\nPlease set these variables in your .env.local file or Netlify dashboard.');
  process.exit(1);
}

console.log('✅ All required environment variables are set');

