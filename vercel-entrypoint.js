/**
 * Vercel Serverless Function Entrypoint
 * 
 * This file acts as the entrypoint for Vercel's serverless functions
 * and imports the main server application built with esbuild
 */

// Create a basic Express app if the built server doesn't exist
const fs = require('fs');
const path = require('path');

let app;

try {
  // Try to import the built server application
  app = require('./dist/index.js');
  console.log('Successfully loaded server from dist/index.js');
} catch (error) {
  console.log('Error loading dist/index.js, using fallback server:', error.message);
  
  // Create a simple Express app as fallback
  const express = require('express');
  const fallbackApp = express();
  
  // Serve static files from dist/public
  fallbackApp.use(express.static(path.join(__dirname, 'dist/public')));
  
  // Catch all routes and serve index.html
  fallbackApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/public/index.html'));
  });
  
  app = fallbackApp;
}

/**
 * Serverless function handler for Vercel
 * 
 * This exports the Express app for Vercel's serverless function handler
 */
module.exports = app;