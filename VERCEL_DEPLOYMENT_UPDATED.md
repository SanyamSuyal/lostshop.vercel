# Vercel Deployment Guide (Fixed)

This is a step-by-step guide to successfully deploy this application on Vercel without getting 404 errors.

## Step 1: Prepare Your Project

First, ensure your local project is set up correctly:

1. Make sure you have the following files correctly set up:
   - `vercel.json` - Proper routing configuration
   - `api/index.js` - Serverless function entrypoint
   - `server/database-config.ts` - SSL and connection handling

2. The simplest way is to run the included helper script:
   ```
   ./vercel.sh
   ```
   This will set up all required files automatically.

## Step 2: Set Required Environment Variables

In your Vercel project settings, add the following environment variables:

1. `DATABASE_URL` - Your Neon PostgreSQL connection string
   - Format: `postgres://username:password@hostname:port/database?sslmode=require`
   - The `sslmode=require` part is critical!

2. `SESSION_SECRET` - A strong random string for session encryption

3. Any other environment variables your app needs

## Step 3: Deploy to Vercel

Deploy using the Vercel CLI or GitHub integration:

```
vercel
```

## Step 4: Testing Your Deployment

After deployment, test these URLs:

1. Health check:
   ```
   https://your-app-name.vercel.app/health
   ```

2. API test endpoint:
   ```
   https://your-app-name.vercel.app/api/test
   ```

3. Your main application:
   ```
   https://your-app-name.vercel.app/
   ```

## Troubleshooting

If you still encounter 404 errors:

1. **Check API Routes**: Make sure all your API routes are prefixed with `/api/`

2. **Database Connection**: Verify your DATABASE_URL contains `?sslmode=require`

3. **Environment Variables**: Confirm all required env vars are set in Vercel

4. **Cache Issues**: Try deploying with the `--force` flag to rebuild caches:
   ```
   vercel --force
   ```

5. **Check Logs**: In the Vercel dashboard, check Function Logs and Build Logs

Remember, the most common issues are:
- Incorrect database connection string (missing SSL mode)
- Routing configuration in vercel.json
- Missing environment variables
