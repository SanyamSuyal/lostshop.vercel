/**
 * Vercel Serverless Function Entrypoint
 * 
 * This file acts as the entrypoint for Vercel's serverless functions
 * and imports the main server application built with esbuild
 */

// Import the built server application
import app from './dist/index.js';

/**
 * Serverless function handler for Vercel
 * 
 * This exports the Express app directly for Vercel's serverless function handler
 */
export default app;