# Deploying to Vercel

This guide will help you deploy your Discord bot marketplace application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/signup) to push your code to (optional, but recommended)
- A [Neon PostgreSQL](https://neon.tech) database (or another PostgreSQL provider)

## Setup Steps

### 1. Database Configuration

Make sure you have your PostgreSQL database URL ready. If you're using Neon:

1. Create a new project in Neon
2. Get your connection string from the dashboard
3. You'll need to add this as an environment variable in Vercel

### 2. Vercel Setup

1. Push your code to GitHub (recommended)
2. Log in to Vercel and create a new project
3. Import your repository from GitHub
4. Configure the project as follows:

   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` 
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SESSION_SECRET`: A secure random string for session encryption
     - Any other API keys your application requires

5. Deploy your project

### 3. Vercel Configuration

Vercel should automatically detect your Node.js project. The `vercel.json` file in your project root configures:

- Server-side rendering for your backend API
- Static serving for your frontend assets
- Routing to direct API calls to your backend and all other requests to your frontend

If you encounter issues with routing or builds, you might need to adjust the `vercel.json` file.

## After Deployment

1. Run the database migration to set up your database schema:
   - This will happen during the build process if configured correctly

2. Monitor your application logs in the Vercel dashboard for any issues

3. Set up a custom domain if needed through the Vercel dashboard

## Troubleshooting

### Build Error: "Could not resolve entry module "client/index.html""

If you encounter this error, it means Vite can't find the entry file for your application. 
Our updated `vercel.json` contains a custom build command that should fix this issue by:

1. Changing to the client directory before running the Vite build
2. Specifying the correct output directory
3. Running server build separately

The new configuration uses Vercel's direct support for custom build commands instead of relying on npm scripts.

### 404 Page Not Found Error

If you encounter a 404 error after deployment, try these solutions:

1. **Check Environment Variables**:
   - Make sure `DATABASE_URL` is correctly set with the full connection string
   - Verify that all secrets are properly configured (SESSION_SECRET, MAIN_LTC_ADDRESS)

2. **Re-deploy with "Public" Environment Variables**:
   - In your Vercel project, go to Settings → Environment Variables
   - Make sure your DATABASE_URL is properly formatted
   - If you see "references Secret 'database-url', which does not exist" error:
     - Try creating a new environment variable with a different name
     - Or mark your environment variable as "Public" instead of "Secret"

3. **Try a Different Approach**:
   - In Vercel, go to your project settings
   - Click "Override" on the Build Command and set it to: `npm run build`
   - Set the Output Directory to: `dist`
   - Set the Install Command to: `npm install`

4. **Check Function Regions**:
   - In Vercel, go to Settings → Functions
   - Make sure your function region is set appropriately (close to your database region)

5. **Other Common Issues**:
   - Database Issues: Make sure your `DATABASE_URL` is correctly set and accessible
   - Build Errors: Check the build logs in Vercel for specific errors
   - API Not Working: Verify the routes in `vercel.json` are correctly configured
   - Session Issues: Ensure `SESSION_SECRET` is set and doesn't change between deployments