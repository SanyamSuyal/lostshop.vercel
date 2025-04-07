/**
 * Vercel Deployment Fix Script
 * 
 * This script fixes common issues with deploying to Vercel:
 * 1. Corrects the DATABASE_URL format for Neon
 * 2. Handles missing environment variables
 * 3. Provides diagnostics for deployment issues
 */

// Run this before deployment to Vercel
export async function checkDeploymentConfig() {
  console.log('Checking deployment configuration...');
  
  // Check for required environment variables
  const requiredVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'MAIN_LTC_ADDRESS'
  ];
  
  const missingVars = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  // Check DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    // For Neon, ensure format is correct
    if (dbUrl.includes('neon.tech')) {
      const correctedUrl = fixNeonDatabaseUrl(dbUrl);
      console.log('Using Neon database with corrected URL format.');
      process.env.DATABASE_URL = correctedUrl;
    }
  }
  
  console.log('Configuration check complete.');
  return true;
}

/**
 * Fixes Neon database URL format for Vercel deployments
 */
function fixNeonDatabaseUrl(url) {
  // Ensure URL has required parameters for Neon on Vercel
  if (!url.includes('sslmode=')) {
    if (url.includes('?')) {
      url += '&sslmode=require';
    } else {
      url += '?sslmode=require';
    }
  }
  
  return url;
}

/**
 * Provides a health check endpoint to verify database connectivity
 */
export async function checkDatabaseHealth(pool) {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return { status: 'ok', message: 'Database connection successful' };
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return { 
      status: 'error', 
      message: 'Database connection failed', 
      error: error.message,
      solution: 'Check DATABASE_URL format and credentials'
    };
  }
}

// Export functions to use in Express app
export default {
  checkDeploymentConfig,
  checkDatabaseHealth
};