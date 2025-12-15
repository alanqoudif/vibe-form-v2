# Netlify Deployment Guide

## Prerequisites

1. Install dependencies (including the Netlify plugin):
   ```bash
   npm install
   ```

2. Ensure all environment variables are set in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (if using AI features)

## Netlify Configuration

The project includes:
- `netlify.toml` - Build configuration
- `@netlify/plugin-nextjs` - Next.js plugin for Netlify

## Build Settings in Netlify Dashboard

1. **Build command**: `npm run build`
2. **Publish directory**: `.next` (handled automatically by plugin)
3. **Node version**: `20` (specified in `.nvmrc`)

## Important Notes

- The app uses Next.js 16 with App Router
- Internationalization is configured with `localePrefix: 'as-needed'`
- Default locale is `en` (English)
- Routes are structured as `/[locale]/...` but the default locale doesn't require the prefix
- The middleware handles locale routing automatically

## Troubleshooting 404 Errors

If you're seeing 404 errors:

1. **Check build logs**: Ensure the build completes successfully
2. **Verify plugin installation**: The `@netlify/plugin-nextjs` plugin should be installed
3. **Check environment variables**: All required env vars must be set
4. **Verify Node version**: Should be Node 20 (check `.nvmrc`)
5. **Clear cache**: Try clearing Netlify's build cache and redeploy

## Testing Locally

Before deploying, test the production build locally:

```bash
npm run build
npm start
```

Then visit `http://localhost:3000` to verify everything works.

## Routes

- `/` - Homepage (defaults to English)
- `/ar` - Arabic homepage
- `/en` - English homepage (explicit)
- `/forms` - Forms list (requires auth)
- `/feed` - Public forms feed
- `/f/[slug]` - Public form view

All routes are handled by the Next.js App Router and Netlify plugin automatically.

