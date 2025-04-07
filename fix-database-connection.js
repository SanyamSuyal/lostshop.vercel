/**
 * Database Connection Fix Script for Vercel
 * 
 * This script will automatically fix the DATABASE_URL connection string
 * for Neon PostgreSQL in Vercel deployments. It handles the specific
 * SSL requirement for Neon databases in Vercel serverless functions.
 */

import fs from 'fs';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}Vercel Database Connection Fix Script${colors.reset}`);
console.log(`${colors.yellow}Checking and fixing DATABASE_URL for Neon PostgreSQL...${colors.reset}`);

// Check if running in Vercel environment
const isVercel = process.env.VERCEL === '1';
if (isVercel) {
  console.log(`${colors.green}✓ Running in Vercel environment${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠ Not running in Vercel environment${colors.reset}`);
}

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error(`${colors.red}✗ DATABASE_URL environment variable is not set!${colors.reset}`);
  console.error(`${colors.yellow}Please set DATABASE_URL in your Vercel environment variables${colors.reset}`);
  process.exit(1);
}

// Check if DATABASE_URL is for Neon PostgreSQL
const dbUrl = process.env.DATABASE_URL;
if (dbUrl.includes('neon.tech')) {
  console.log(`${colors.green}✓ Neon PostgreSQL detected${colors.reset}`);
  
  // Check if it already has sslmode=require
  if (dbUrl.includes('sslmode=require')) {
    console.log(`${colors.green}✓ SSL mode already configured correctly${colors.reset}`);
  } else {
    // Add sslmode=require to the connection string
    const separator = dbUrl.includes('?') ? '&' : '?';
    const fixedUrl = `${dbUrl}${separator}sslmode=require`;
    process.env.DATABASE_URL = fixedUrl;
    
    console.log(`${colors.green}✓ Fixed DATABASE_URL with SSL mode requirement${colors.reset}`);
    console.log(`${colors.cyan}New connection string format: ${fixedUrl.replace(/\/\/.*:.*@/, '//****:****@')}${colors.reset}`);
    
    // Create a temporary file with instructions for the user
    const instructions = `
# Database Connection Fix Applied

Your DATABASE_URL has been temporarily fixed for this session.

To permanently fix this issue:

1. Go to your Vercel project settings
2. Update your DATABASE_URL environment variable to include "?sslmode=require"
3. The correct format should be:
   postgres://username:password@hostname:port/database?sslmode=require

This ensures proper SSL connection for Neon PostgreSQL on Vercel.
`;

    try {
      fs.writeFileSync('.db-connection-fix.txt', instructions);
      console.log(`${colors.cyan}Instructions saved to .db-connection-fix.txt${colors.reset}`);
    } catch (err) {
      console.log(`${colors.yellow}Could not save instructions file: ${err.message}${colors.reset}`);
    }
  }
} else {
  console.log(`${colors.yellow}⚠ Not using Neon PostgreSQL - no changes needed${colors.reset}`);
}

// Export the fixed environment variables
export default {
  DATABASE_URL: process.env.DATABASE_URL
};

console.log(`${colors.cyan}Database connection fix complete${colors.reset}`);