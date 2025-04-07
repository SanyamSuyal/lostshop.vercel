/**
 * Custom build script for Vercel deployment
 * 
 * This script:
 * 1. Builds the client (React) app with Vite
 * 2. Builds the server (Express) app with esbuild
 * 3. Ensures the right paths and structure for Vercel deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

console.log(`${colors.cyan}🔨 Vercel Custom Build Script 🔨${colors.reset}`);

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}
if (!fs.existsSync(path.join(__dirname, 'dist', 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'dist', 'public'));
}

// Step 1: Build client application
try {
  console.log(`${colors.yellow}🏗️  Building client application with Vite...${colors.reset}`);
  execSync('cd client && npx vite build --outDir ../dist/public', { stdio: 'inherit' });
  console.log(`${colors.green}✅ Client build successful!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Client build failed:${colors.reset}`, error.message);
  process.exit(1);
}

// Step 2: Build server application
try {
  console.log(`${colors.yellow}🏗️  Building server application with esbuild...${colors.reset}`);
  
  // Use esbuild with specific options to resolve the issues
  execSync(
    'npx esbuild server/index.ts ' +
    '--format=esm ' +
    '--platform=node ' +
    '--bundle ' +
    '--outdir=dist ' +
    '--external:express ' +
    '--external:pg ' +
    '--external:@neondatabase/serverless ' +
    '--external:drizzle-orm ' +
    '--external:session-file-store ' +
    '--external:express-session',
    { stdio: 'inherit' }
  );
  
  console.log(`${colors.green}✅ Server build successful!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Server build failed:${colors.reset}`, error.message);
  process.exit(1);
}

// Step 3: Create Vercel entrypoint file
try {
  console.log(`${colors.yellow}📝 Creating Vercel serverless function entry...${colors.reset}`);
  
  // Create an API entrypoint file for Vercel serverless functions
  const apiDir = path.join(__dirname, 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir);
  }
  
  // Write the entrypoint file that loads the main server module
  fs.writeFileSync(
    path.join(apiDir, 'index.js'),
    `import '../dist/index.js';\n\nexport default function handler(req, res) {}\n`
  );
  
  console.log(`${colors.green}✅ Vercel entrypoint created!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Failed to create Vercel entrypoint:${colors.reset}`, error.message);
  process.exit(1);
}

// Step 4: Update package.json build script for Vercel
try {
  console.log(`${colors.yellow}🛠️  Ensuring package.json is configured for Vercel...${colors.reset}`);
  
  // Create a Vercel-specific package.json if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'package.json.vercel'))) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    
    // Ensure correct build script
    packageJson.scripts.build = 'node vercel-build.js';
    
    // Save as package.json.vercel for reference
    fs.writeFileSync(
      path.join(__dirname, 'package.json.vercel'),
      JSON.stringify(packageJson, null, 2)
    );
    
    console.log(`${colors.green}✅ Created package.json.vercel reference file${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}❌ Failed to update package.json:${colors.reset}`, error.message);
  // Non-critical - don't exit
}

console.log(`${colors.green}✅ Build complete! Ready for Vercel deployment.${colors.reset}`);