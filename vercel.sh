#!/bin/bash

# Vercel Deployment Helper Script
# This script helps prepare the project for Vercel deployment

echo "🔵 Preparing project for Vercel deployment..."

# Create necessary directories
mkdir -p dist/public api

# Ensure the API entrypoint exists
if [ ! -f api/index.js ]; then
  echo "📝 Creating API entrypoint file..."
  cat > api/index.js << 'EOFAPI'
/**
 * Vercel Serverless Function Entry Point
 */
import express from 'express';
import session from 'express-session';
import passport from 'passport';

// Initialize express app
const app = express();

// Configure express app
app.use(express.json());

// Configure session
const SESSION_SECRET = process.env.SESSION_SECRET || 'development-secret';
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Configure passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'missing'
  });
});

// Simple API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Import server routes (if available)
try {
  import('../dist/index.js');
} catch (error) {
  console.error('Error importing server application:', error);
}

/**
 * Default serverless function handler for Vercel
 */
export default function handler(req, res) {
  return app(req, res);
}
EOFAPI
  echo "✅ API entrypoint created"
fi

# Ensure vercel.json exists
if [ ! -f vercel.json ]; then
  echo "📝 Creating vercel.json configuration..."
  cat > vercel.json << 'EOFJSON'
{
  "version": 2,
  "buildCommand": "cd client && npx vite build --outDir ../dist/public && cd .. && npx esbuild server/index.ts --format=esm --platform=node --bundle --outdir=dist --external:express --external:pg",
  "outputDirectory": "dist",
  "framework": null,
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/api" },
    { "src": "/health", "dest": "/api" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOFJSON
  echo "✅ vercel.json created"
fi

# Fix database connections for Vercel
echo "🔧 Creating database configuration utility..."
mkdir -p server
cat > server/database-config.ts << 'EOFDB'
import { Pool, PoolConfig } from 'pg';
import * as schema from '../shared/schema';

// Import drizzle dynamically to avoid issues
const drizzle = (client: any, options?: any) => {
  try {
    const { drizzle: drizzleFn } = require('drizzle-orm/postgres-js');
    return drizzleFn(client, options);
  } catch (error) {
    const { drizzle: drizzleFn } = require('drizzle-orm/node-postgres');
    return drizzleFn(client, options);
  }
};

export function getDatabaseConfig(): PoolConfig {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  let connectionString = process.env.DATABASE_URL;

  // Add SSL mode for Neon PostgreSQL in Vercel
  if (process.env.VERCEL === '1' && !connectionString.includes('sslmode=require')) {
    const separator = connectionString.includes('?') ? '&' : '?';
    connectionString = `${connectionString}${separator}sslmode=require`;
  }

  return { connectionString };
}

export function initializeDatabase() {
  const config = getDatabaseConfig();
  const pool = new Pool(config);
  const db = drizzle(pool, { schema });
  return { pool, db };
}
EOFDB
echo "✅ Database configuration utility created"

echo "✅ Project is ready for Vercel deployment"
echo "🚀 Deploy using: vercel deploy"
