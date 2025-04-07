#!/bin/bash

# Vercel Build Script
# This script builds both the client and server components of the application for Vercel deployment

set -e # Exit immediately if a command exits with a non-zero status

echo "═════════════════════════════════════════════════"
echo "           VERCEL DEPLOYMENT BUILD SCRIPT         "
echo "═════════════════════════════════════════════════"
echo "Starting build process..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL is not set. Database connections will fail!"
fi

if [ -z "$SESSION_SECRET" ]; then
  echo "⚠️  WARNING: SESSION_SECRET is not set. Using a default value (insecure)!"
  export SESSION_SECRET="default-dev-secret-replace-in-production"
fi

# Create necessary directories
echo "Creating build directories..."
mkdir -p dist/public

# Build client
echo "Building client application..."
cd client
npx vite build
echo "✅ Client build complete"

# Move static assets to the correct location
echo "Moving static assets to dist/public..."
cp -r ../dist/public .
cd ..

# Build server
echo "Building server application..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
echo "✅ Server build complete"

# Create health check file
echo "Creating health check file..."
cat > dist/health.js << 'HEALTHEND'
export default function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
HEALTHEND
echo "✅ Health check endpoint created"

echo "═════════════════════════════════════════════════"
echo "✅ BUILD COMPLETED SUCCESSFULLY"
echo "═════════════════════════════════════════════════"
echo "The application is ready for deployment to Vercel."
echo "Make sure to set the following environment variables in Vercel:"
echo "- DATABASE_URL"
echo "- SESSION_SECRET"
echo "- Add any additional API keys required by the application"
