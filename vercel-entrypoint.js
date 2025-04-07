/**
 * Vercel Serverless Function Entrypoint
 * 
 * This file acts as the entrypoint for Vercel's serverless functions
 * and imports the main server application built with esbuild
 */

// Import the built server application
import './dist/index.js';

/**
 * Serverless function handler for Vercel
 * 
 * This function won't actually be called since we're using middleware
 * in our Express app to handle all requests, but Vercel requires an
 * export default function for serverless functions.
 */
export default function handler(req, res) {
  // The actual request handling is done by the Express app
  // This is just a placeholder required by Vercel's serverless function format
}