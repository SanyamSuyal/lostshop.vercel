import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Clear and recreate build directories
console.log('Setting up build directories...');
if (fs.existsSync('dist')) {
  console.log('Cleaning existing dist directory...');
  fs.rmSync('dist', { recursive: true, force: true });
}

fs.mkdirSync('dist');
fs.mkdirSync('dist/public');

// Copy package.json.vercel to package.json for the build
console.log('Setting up Vercel-specific package.json...');
if (fs.existsSync('package.json.vercel')) {
  fs.copyFileSync('package.json.vercel', 'package.json.build');
  console.log('Using Vercel-specific package configuration');
}

// Build client first
console.log('Building client...');
try {
  // Set client directory as working directory
  process.chdir('./client');
  execSync('npx vite build', {
    stdio: 'inherit',
    env: { 
      ...process.env,
      VITE_CWD: path.resolve(process.cwd())
    }
  });
  // Return to root directory
  process.chdir('..');
  
  // Copy client build to dist/public
  console.log('Copying client build to dist/public...');
  execSync('cp -r client/dist/* dist/public/', { stdio: 'inherit' });
  
  console.log('Client build successful!');
} catch (error) {
  console.error('Client build failed:', error);
  process.exit(1);
}

// Build server
console.log('Building server...');
try {
  // Build server with explicit external dependencies to avoid bundling issues
  execSync('npx esbuild server/index.ts --format=esm --bundle --platform=node --outdir=dist --external:express --external:pg --external:@neondatabase/serverless --external:drizzle-orm --external:passport --external:passport-local --external:connect-pg-simple', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Server build successful!');
} catch (error) {
  console.error('Server build failed:', error);
  process.exit(1);
}

// Ensure all required files for Vercel deployment are in place
console.log('Finalizing build for Vercel deployment...');
if (!fs.existsSync('api')) {
  fs.mkdirSync('api');
}

// Create the Vercel serverless function entrypoint
fs.writeFileSync('api/index.js', `
// Vercel serverless function entrypoint
export { default } from '../dist/index.js';
`);

console.log('Build completed successfully!');