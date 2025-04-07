# Updated Vercel Deployment Guide for LostShop

This guide provides detailed instructions for deploying the LostShop application to Vercel.

## Prerequisites

1. A Vercel account
2. Git repository with your LostShop codebase
3. PostgreSQL database (such as Neon)

## Environment Variables

The following environment variables must be set in your Vercel project:

```
DATABASE_URL=postgres://username:password@hostname:port/database?sslmode=require
SESSION_SECRET=a-secure-random-string-for-sessions
MAIN_LTC_ADDRESS=your-litecoin-wallet-address
```

## Deployment Steps

1. **Import your repository to Vercel**:
   - Go to https://vercel.com/new
   - Select your Git repository
   - Import project

2. **Configure build settings**:
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist/public`
   - Set Install Command: `npm install`

3. **Add environment variables**:
   - In the project settings, add all required environment variables
   - Make sure DATABASE_URL is properly formatted with correct credentials

4. **Deploy the application**:
   - Click "Deploy" button
   - Wait for deployment to complete

## Troubleshooting Common Issues

### Database Connection Issues

If you encounter errors related to database connections:

1. Verify your DATABASE_URL format:
   ```
   postgres://username:password@hostname:port/database?sslmode=require
   ```

2. Check the database server is accessible from Vercel's infrastructure (Neon requires specific connection string format)

3. For Neon PostgreSQL, make sure you're using the correct connection string format:
   ```
   postgres://username:password@hostname:port/database?sslmode=require
   ```

### Build Failures

If the build process fails:

1. Check the build logs for specific errors
2. Verify that all dependencies are properly listed in package.json
3. Make sure the build commands are correctly set up

### API Route Issues

If API routes don't work:

1. Verify the Vercel configuration in vercel.json is correct
2. Check that api/index.js exists and properly exports the server application
3. Ensure all serverless function handlers are properly set up

## Manual Deployment

If you encounter persistent issues with Vercel's UI, you can use the Vercel CLI:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy from your project directory:
   ```
   vercel --prod
   ```

## Checking Deployment Status

To verify your deployment is working correctly:

1. Check the Vercel deployment URL
2. Test the application's functionality
3. Monitor logs in the Vercel dashboard
4. Test the `/health` endpoint to verify database connectivity

For additional assistance, consult the Vercel documentation or contact Vercel support.