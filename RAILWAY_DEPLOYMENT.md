# Railway Deployment Guide

This document provides instructions for deploying the LostShop application on Railway.

## Prerequisites

1. A [Railway](https://railway.app) account
2. A GitHub account (for easier deployment)

## Deployment Steps

### 1. Fork or Push Your Repository to GitHub

- Upload your codebase to a GitHub repository

### 2. Create a New Project on Railway

1. Log in to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect your Node.js application

### 3. Add a PostgreSQL Database

1. In your project dashboard, click "New"
2. Select "Database" from the dropdown
3. Choose "PostgreSQL"
4. Wait for the database to be provisioned

### 4. Link the Database to Your Application

1. In your project settings, navigate to the "Variables" tab
2. Create a new variable named `DATABASE_URL` 
3. Railway will automatically fill it with the connection string to your PostgreSQL database
4. Add these additional variables:
   - `SESSION_SECRET` - A random string for session security
   - `MAIN_LTC_ADDRESS` - Your Litecoin address for payments
   - `NODE_ENV` - Set to "production"

### 5. Deploy Your Application

1. Railway will automatically deploy your application
2. Once the deployment is complete, click "Settings" and then "Domains"
3. Generate a public domain for your application

### 6. Run Database Migrations

After deployment:

1. Go to your project in Railway
2. Click on the "Shell" tab
3. Run the database migration command:
   ```
   npm run db:push
   ```

## Troubleshooting

If you encounter any issues:

1. Check the deployment logs for errors
2. Verify that all environment variables are set correctly
3. Make sure your database is connected properly
4. Check that your application is listening on the PORT environment variable

## Important Notes

- Railway will automatically assign a PORT to your application
- The free tier has a $5 credit limit per month
- Your application might sleep after periods of inactivity