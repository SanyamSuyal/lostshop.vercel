#!/bin/bash

# Railway deployment helper script

# Install Railway CLI if not already installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm i -g @railway/cli
fi

# Login to Railway (if not already logged in)
railway login

# Link to the Railway project (if not already linked)
if [ ! -f .railway/config.json ]; then
    echo "Linking to Railway project..."
    railway link
fi

# Deploy the project
echo "Deploying to Railway..."
railway up

# Show the project status
echo "Project status:"
railway status

echo "Deployment complete! Visit your project in the Railway dashboard: https://railway.app/dashboard"