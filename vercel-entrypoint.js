// Vercel serverless function entrypoint
// This file handles all API requests in the Vercel environment

import fs from 'fs';
import path from 'path';

// Check if the app has been built
let serverModule;
let errorState = null;

try {
  // Try to dynamically import the built server module
  serverModule = await import('./dist/index.js');
  console.log('Server module loaded successfully');
} catch (error) {
  console.error('Failed to load server module:', error);
  errorState = error;
}

// Re-export the server module
export * from './dist/index.js';

// Add a health check route
export default function handler(req, res) {
  // Handle the /health endpoint separately
  if (req.url === '/health') {
    // If we had an error loading the server module, return that error
    if (errorState) {
      return res.status(500).json({
        status: 'error',
        message: 'Server module failed to load',
        error: errorState.message,
        stack: process.env.NODE_ENV === 'development' ? errorState.stack : undefined,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          hasDatabase: !!process.env.DATABASE_URL,
          dist: fs.existsSync('./dist') ? 'exists' : 'missing',
          distIndex: fs.existsSync('./dist/index.js') ? 'exists' : 'missing',
        }
      });
    }
    
    // Otherwise return a healthy status
    return res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  }
  
  // If the server module failed to load, return an error for all requests
  if (errorState) {
    return res.status(500).json({
      status: 'error',
      message: 'Application failed to initialize',
      path: req.url
    });
  }
  
  // For all other requests, delegate to the server module
  return serverModule.default(req, res);
}