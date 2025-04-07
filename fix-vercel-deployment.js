/**
 * Vercel Deployment Fix Utility
 *
 * This script helps identify and fix common issues with Vercel deployments:
 * - Fixes database connection string for Neon PostgreSQL
 * - Verifies environment variables
 * - Creates the necessary files for proper serverless function handling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}Vercel Deployment Fix Utility${colors.reset}`);
console.log('---------------------------');

/**
 * Fixes Neon database URL format for Vercel deployments
 */
function fixNeonDatabaseUrl(url) {
  if (!url) return null;
  
  if (url.includes('neon.tech') && !url.includes('sslmode=require')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}sslmode=require`;
  }
  
  return url;
}

/**
 * Checks if all required environment variables are set
 */
function checkRequiredEnvVars() {
  const required = ['DATABASE_URL', 'SESSION_SECRET'];
  const missing = [];
  
  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  return { 
    valid: missing.length === 0,
    missing
  };
}

/**
 * Ensures the API directory exists for Vercel serverless functions
 */
function ensureApiDirectory() {
  const apiDir = path.join(__dirname, 'api');
  
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir);
    console.log(`${colors.green}✓ Created API directory for Vercel serverless functions${colors.reset}`);
  }
  
  // Create the Vercel serverless function entrypoint
  const apiIndexPath = path.join(apiDir, 'index.js');
  if (!fs.existsSync(apiIndexPath)) {
    fs.writeFileSync(
      apiIndexPath,
      `import '../dist/index.js';\n\nexport default function handler(req, res) {}\n`
    );
    console.log(`${colors.green}✓ Created API entrypoint for Vercel serverless functions${colors.reset}`);
  }
}

/**
 * Provides a health check endpoint to verify database connectivity
 */
export async function checkDatabaseHealth(pool) {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT version()');
      return {
        connected: true,
        version: result.rows[0].version
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

/**
 * Main function to check and fix deployment configuration
 */
export async function checkDeploymentConfig() {
  // 1. Check environment variables
  const envCheck = checkRequiredEnvVars();
  if (!envCheck.valid) {
    console.log(`${colors.red}✗ Missing required environment variables: ${envCheck.missing.join(', ')}${colors.reset}`);
    console.log(`${colors.yellow}Please set these in your Vercel project settings.${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ All required environment variables are set${colors.reset}`);
  }
  
  // 2. Fix DATABASE_URL if needed
  if (process.env.DATABASE_URL) {
    const fixedUrl = fixNeonDatabaseUrl(process.env.DATABASE_URL);
    if (fixedUrl !== process.env.DATABASE_URL) {
      process.env.DATABASE_URL = fixedUrl;
      console.log(`${colors.green}✓ Fixed DATABASE_URL for Neon PostgreSQL${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ DATABASE_URL is correctly formatted${colors.reset}`);
    }
  }
  
  // 3. Ensure API directory exists
  ensureApiDirectory();
  
  // 4. Check database connectivity
  if (process.env.DATABASE_URL) {
    console.log(`${colors.yellow}Testing database connection...${colors.reset}`);
    
    try {
      const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('neon.tech') ? 
          { rejectUnauthorized: false } : undefined
      });
      
      const health = await checkDatabaseHealth(pool);
      
      if (health.connected) {
        console.log(`${colors.green}✓ Successfully connected to database${colors.reset}`);
        console.log(`${colors.green}  Database version: ${health.version}${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ Database connection failed: ${health.error}${colors.reset}`);
        console.log(`${colors.yellow}Please check your DATABASE_URL format and credentials.${colors.reset}`);
      }
      
      await pool.end();
    } catch (error) {
      console.log(`${colors.red}✗ Failed to initialize database connection: ${error.message}${colors.reset}`);
    }
  }
  
  console.log(`${colors.cyan}Deployment check complete${colors.reset}`);
}

// Run the check if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkDeploymentConfig().catch(console.error);
}

export default {
  checkDeploymentConfig,
  checkDatabaseHealth
};