#!/bin/bash

# Create build directories
echo "Creating build directories..."
mkdir -p dist/public

# Build the client
echo "Building client..."
export VITE_CWD=$(pwd)/client
npx vite build

# Build the server
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"
