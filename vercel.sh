#!/bin/bash

# Vercel Deployment Script

# Copy package.json.vercel to package.json for Vercel deployment
echo "Configuring package.json for Vercel..."
cp package.json.vercel package.json

# Make sure build script is executable
chmod +x vercel-build.sh

# Commit the changes
echo "Committing changes..."
git add .
git commit -m "Configure for Vercel deployment"

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
