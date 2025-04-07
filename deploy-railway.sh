#!/bin/bash

# Railway Deployment Script

# Build the client
echo "Building client..."
export VITE_CWD=$(pwd)/client
npx vite build

# Build the server
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Push schema to database
echo "Pushing database schema..."
npm run db:push

echo "Build complete! Your app is ready for Railway deployment."
