# Deploying to Vercel

This guide will help you deploy your LostShop marketplace application to Vercel with our improved deployment configuration.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/signup) to push your code to (optional, but recommended)
- A [Neon PostgreSQL](https://neon.tech) database (or another PostgreSQL provider)

## Quick Deployment

The easiest way to deploy is using our automated deployment script:

```bash
./vercel.sh
```

This script:
1. Configures your package.json for Vercel
2. Makes the build script executable 
3. Commits the changes
4. Deploys to Vercel in production mode

## Manual Setup Steps

### 1. Database Configuration

Make sure you have your PostgreSQL database URL ready. If you're using Neon:

1. Create a new project in Neon
2. Get your connection string from the dashboard
3. You'll need to add this as an environment variable in Vercel

### 2. Configure for Vercel

1. Copy the Vercel-specific package.json:
   ```bash
   cp package.json.vercel package.json
   ```

2. Ensure the build scripts are marked as executable:
   ```bash
   chmod +x vercel-build.sh
   ```

3. Push your code to GitHub (recommended)

### 3. Vercel Setup

1. Log in to Vercel and create a new project
2. Import your repository from GitHub
3. Configure the project as follows:

   - **Build Command**: `node vercel-build.js`
   - **Output Directory**: `dist/public` 
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SESSION_SECRET`: A secure random string for session encryption
     - Any other API keys your application requires (STRIPE_SECRET_KEY, etc.)

4. Deploy your project

## How Our Deployment Works

The deployment configuration includes several improvements:

1. **Optimized Build Process**:
   - `vercel-build.js` - Handles building both client and server
   - `package.json.vercel` - Simplified package.json for Vercel environment

2. **Improved Serverless Function**:
   - `vercel-entrypoint.js` - Enhanced serverless function entrypoint with:
     - Better error handling
     - Detailed diagnostics
     - Health check endpoint

3. **Advanced Routing**:
   - Proper static asset routing
   - API call handling
   - Health check endpoint for monitoring

4. **Error Diagnosis**:
   - Health check endpoint at `/health` for quick diagnosis
   - Detailed error reporting when the application fails to start

## After Deployment

1. Test your application thoroughly, including:
   - Authentication flows
   - API endpoints
   - Database connections
   - Payment processing

2. Check the health endpoint to verify status:
   ```
   https://your-app-name.vercel.app/health
   ```

3. Monitor your application logs in the Vercel dashboard for any issues

4. Set up a custom domain if needed through the Vercel dashboard

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the Vercel build logs for specific error messages
2. Verify your environment variables are correctly set 
3. Try running the build locally to identify issues:
   ```bash
   node vercel-build.js
   ```

### 404 Page Not Found Error

If you encounter a 404 error after deployment:

1. **Check Health Endpoint**: 
   - Visit `https://your-app-name.vercel.app/health`
   - This provides diagnostic information about your deployment

2. **Verify Environment Variables**:
   - Make sure `DATABASE_URL` is correctly set with the full connection string
   - Ensure `SESSION_SECRET` is properly configured
   - Check that all required API keys are present

3. **Database Connection Issues**:
   - Ensure your database is accessible from Vercel's serverless functions
   - Check that your connection string includes all necessary parameters
   - Try using the Neon serverless driver instead of direct PostgreSQL connection

4. **Deployment Configuration**:
   - Verify `vercel.json` has the correct routing configuration
   - Check that the build output is going to the expected directory
   - Ensure the serverless function is correctly configured

### API Not Working

If your API endpoints are not working:

1. Check server logs in the Vercel dashboard
2. Verify that the `/api` route is correctly configured in `vercel.json`
3. Ensure your database connection is working properly
4. Test authentication endpoints to confirm session handling is working

### Connection Errors

If your application fails to connect to external services:

1. Verify all environment variables are correctly set
2. Check that API keys have the correct permissions
3. Ensure your database allows connections from Vercel's IP ranges
4. Try using Vercel's integration for your database provider if available
