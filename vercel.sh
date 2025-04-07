#!/bin/bash

# Vercel build script
echo "Building client and server for Vercel deployment..."

# Build the client
echo "Building client..."
vite build

# Build the server
echo "Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"
