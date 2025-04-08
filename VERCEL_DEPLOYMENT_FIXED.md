# LostShop Vercel Deployment Fix

This guide explains how to fix the 404 error issue when deploying LostShop to Vercel.

## Configuration Changes

The following files have been updated to fix the deployment:

1. **vercel.json** - Updated the routing and build configuration
2. **api/index.js** - Improved API handling
3. **package.json** - Updated build script

## How to Deploy to Vercel

1. Push these changes to your Git repository
2. Connect your repo to Vercel (if not already connected)
3. In Vercel, set up the following:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

```
NODE_ENV=production
DATABASE_URL=your_database_connection_string
```

## Troubleshooting

If you still encounter issues:

1. Check Vercel build logs for errors
2. Verify that the static files are being built to `dist/public` directory
3. Confirm that API endpoints are accessible at `/api/test` and `/health`

## Testing Deployment

After deploying, verify these URLs work:
- Your main domain (should show the LostShop homepage)
- `yourdomain.com/api/test` (should return a JSON response)
- `yourdomain.com/health` (should return status information)

## Important Notes

- This configuration uses a simplified API handler to ensure basic functionality
- The full server application will need additional configuration for database connections and other features
- No LostShop code was modified, only deployment configuration 