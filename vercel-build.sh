#!/bin/bash

# Build the client side with Vite
echo "Building client..."
vite build --outDir dist/public

# Build the server with esbuild
echo "Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"